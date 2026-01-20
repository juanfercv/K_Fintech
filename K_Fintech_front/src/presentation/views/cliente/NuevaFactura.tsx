import React, { useState, useEffect, useRef, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Cliente } from '../../../domain/entities/Cliente';
import { type DetalleFactura } from '../../../domain/entities/Factura';

const NuevaFactura: React.FC = () => {
    const navigate = useNavigate();

    // ================== ESTADOS ==================
    const [tiendas, setTiendas] = useState<any[]>([]);
    const [idTiendaSel, setIdTiendaSel] = useState<number | string>('');
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [mostrarRegistroRapido, setMostrarRegistroRapido] = useState(false);
    const [mensajeCliente, setMensajeCliente] = useState('');

    const [nuevoCliente, setNuevoCliente] = useState({
        nombre_cliente: '',
        direccion_cliente: '',
        correo_cliente: '',
        celular_cliente: ''
    });

    const [detalles, setDetalles] = useState<DetalleFactura[]>([]);
    const [descuento, setDescuento] = useState(0);

    const [totales, setTotales] = useState({
        subtotal: 0,
        iva: 0,
        total: 0
    });
    const [metodosPago, setMetodosPago] = useState<any[]>([]);
    const [metodoPagoSel, setMetodoPagoSel] = useState<number | string>('');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const inputsRef = useRef<Record<string, HTMLInputElement | null>>({});
    const lastAddedIndexRef = useRef<number | null>(null);

    // ================== DATOS ==================
    useEffect(() => {
        fetch('/api/tiendas')
            .then(res => res.json())
            .then(data => setTiendas(data))
            .catch(err => console.error(err));
        // cargar formas de pago y normalizar campos
        fetch('/api/formas_pago')
            .then(r => r.json())
            .then(d => {
                const normalized = (d || []).map((m: any) => ({
                    id: m.id ?? m.id_forma_pago ?? m.idFormaPago ?? m.id_formaPago,
                    nombre: m.nombre ?? m.nombre_forma_pago ?? m.name,
                    descripcion: m.descripcion ?? m.descripcion_forma_pago ?? m.detalle ?? m.description
                }));
                setMetodosPago(normalized);
            })
            .catch(() => setMetodosPago([]));
    }, []);

    const tiendaSeleccionada = tiendas.find(t => t.idTienda == idTiendaSel);

    const buscarCliente = async (cedula: string) => {
        setCedulaBusqueda(cedula);

        if (cedula.length < 10) {
            setMensajeCliente('Mínimo 10 dígitos');
            setClienteSeleccionado(null);
            return;
        }

        setMensajeCliente('Buscando...');
        const res = await fetch('/api/clientes');
        const lista: Cliente[] = await res.json();
        const encontrado = lista.find(c => c.cedula_cliente === cedula);

        if (encontrado) {
            setClienteSeleccionado(encontrado);
            setMostrarRegistroRapido(false);
            setMensajeCliente('✅ Cliente encontrado');
        } else {
            setClienteSeleccionado(null);
            setMostrarRegistroRapido(true);
            setMensajeCliente('❌ Cliente no existe, registre los datos');
        }
    };

    // ================== CÁLCULOS ==================
    useEffect(() => {
        let subtotal = 0;

        detalles.forEach(d => {
            const total = Number(d.cantidad) * Number(d.precio_unitario);
            subtotal += total;
        });

        const iva = subtotal * 0.15;

        setTotales({
            subtotal,
            iva,
            total: subtotal + iva - descuento
        });
    }, [detalles, descuento]);

    // ================== DETALLES ==================
    const agregarFila = () => {
        setDetalles(prev => {
            const idx = prev.length;
            lastAddedIndexRef.current = idx;
            return [...prev, {
                descripcion: '',
                cantidad: 1,
                precio_unitario: 0,
                precio_total: 0
            }];
        });
    };

    useEffect(() => {
        const idx = lastAddedIndexRef.current;
        if (idx !== null) {
            const el = inputsRef.current[`cantidad-${idx}`];
            setTimeout(() => el?.focus(), 50);
            lastAddedIndexRef.current = null;
        }
    }, [detalles.length]);

    const eliminarFila = (i: number) => {
        setDetalles(detalles.filter((_, index) => index !== i));
    };

    const actualizarItem = (i: number, campo: keyof DetalleFactura, valor: any) => {
        const copia = [...detalles];
        // @ts-ignore
        copia[i][campo] = valor;
        copia[i].precio_total = Number(copia[i].cantidad) * Number(copia[i].precio_unitario);
        setDetalles(copia);
    };

    // ================== GUARDAR ==================
    const emitirFactura = async () => {
        if (!idTiendaSel) return alert('Seleccione tienda');
        if (!clienteSeleccionado && !mostrarRegistroRapido) return alert('Identifique cliente');
        if (metodoPagoSel === '' || metodoPagoSel === null || metodoPagoSel === undefined) return alert('Seleccione forma de pago');
        if (detalles.length === 0) return alert('Agregue productos');

        try {
            let idCliente = clienteSeleccionado?.id_cliente;

            if (mostrarRegistroRapido) {
                const r = await fetch('/api/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...nuevoCliente, cedula_cliente: cedulaBusqueda })
                });
                const cli = await r.json();
                idCliente = cli.id_cliente;
            }

            const payload = {
                idTienda: idTiendaSel,
                idCliente,
                fecha_emision: new Date().toISOString().split('T')[0],
                estado_factura: 'Emitida',
                idFormaPago: Number(metodoPagoSel)
            };
            console.log('Emitir factura payload:', payload);
            const res = await fetch('/api/facturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const factura = await res.json();

            for (const d of detalles) {
                await fetch(`/api/add/${factura.idFactura}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(d)
                });
            }

            setSuccessMsg('Factura emitida correctamente');
            setTimeout(() => navigate('/facturas'), 1200);

        } catch (e: any) {
            alert('Error: ' + e.message);
        }
    };

    // ================== UI ==================
    return (
        <div style={container}>
            <h2>Nueva Factura</h2>

            {/* TIENDA / CLIENTE */}
            <div style={grid2}>
                <div style={card}>
                    <h3>🏪 Tienda</h3>
                    <select style={input} value={idTiendaSel} onChange={e => setIdTiendaSel(e.target.value)}>
                        <option value="">Seleccione tienda</option>
                        {tiendas.map(t => (
                            <option key={t.idTienda} value={t.idTienda}>{t.nombreTienda}</option>
                        ))}
                    </select>

                    {tiendaSeleccionada && (
                        <div style={info}>
                            <p><b>RUC:</b> {tiendaSeleccionada.RUCTienda}</p>
                            <p><b>Dirección:</b> {tiendaSeleccionada.direccion_sucursal_tienda}</p>
                            <p><b>Correo:</b> {tiendaSeleccionada.correo_electronico_tienda}</p>
                            <p><b>Tel:</b> {tiendaSeleccionada.telefono}</p>
                        </div>
                    )}
                </div>

                <div style={card}>
                    <h3>👤 Cliente</h3>
                    <input style={input} placeholder="Cédula / RUC"
                        value={cedulaBusqueda}
                        onChange={e => buscarCliente(e.target.value)} />
                    <p style={{ fontSize: 13 }}>{mensajeCliente}</p>

                    {clienteSeleccionado && (
                        <div style={info}>
                            <p><b>Nombre:</b> {clienteSeleccionado.nombre_cliente}</p>
                            <p><b>Correo:</b> {clienteSeleccionado.correo_cliente}</p>
                            <p><b>Dirección:</b> {clienteSeleccionado.direccion_cliente}</p>
                            <p><b>Tel:</b> {clienteSeleccionado.celular_cliente}</p>
                        </div>
                    )}

                    {mostrarRegistroRapido && (
                        <div style={{ display: 'grid', gap: 8 }}>
                            <input style={input} placeholder="Nombre"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, nombre_cliente: e.target.value })} />
                            <input style={input} placeholder="Dirección"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, direccion_cliente: e.target.value })} />
                            <input style={input} placeholder="Correo"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, correo_cliente: e.target.value })} />
                            <input style={input} placeholder="Teléfono"
                                onChange={e => setNuevoCliente({ ...nuevoCliente, celular_cliente: e.target.value })} />
                        </div>
                    )}
                </div>
            </div>

            {/* DETALLE */}
            <table style={table}>
                <thead>
                    <tr>
                        <th style={th}>Cant</th>
                        <th style={th}>Descripción</th>
                        <th style={th}>P.Unit</th>
                        <th style={{ ...th, textAlign: 'right' }}>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {detalles.map((d, i) => (
                        <tr key={i}>
                            <td>
                                <input
                                    type="number"
                                    step="0.5"
                                    style={cell}
                                    value={d.cantidad}
                                    ref={el => { inputsRef.current[`cantidad-${i}`] = el; }}
                                    onChange={e => actualizarItem(i, 'cantidad', parseFloat(e.target.value || '0'))}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            inputsRef.current[`descripcion-${i}`]?.focus();
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    style={cell}
                                    value={d.descripcion}
                                    ref={el => { inputsRef.current[`descripcion-${i}`] = el; }}
                                    onChange={e => actualizarItem(i, 'descripcion', e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            inputsRef.current[`precio-${i}`]?.focus();
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    step="0.01"
                                    style={cell}
                                    value={d.precio_unitario}
                                    ref={el => { inputsRef.current[`precio-${i}`] = el; }}
                                    onChange={e => actualizarItem(i, 'precio_unitario', parseFloat(e.target.value || '0'))}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            // si es la última fila, añadir nueva y enfocar su cantidad
                                            if (i === detalles.length - 1) {
                                                agregarFila();
                                            } else {
                                                inputsRef.current[`cantidad-${i + 1}`]?.focus();
                                            }
                                        }
                                    }}
                                />
                            </td>
                            <td style={{ textAlign: 'right', padding: 10 }}>
                                ${Number(d.precio_total || 0).toFixed(2)}
                            </td>
                            <td>
                                <button onClick={() => eliminarFila(i)} style={delBtn}>✖</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={agregarFila} style={btnAdd}>+ Añadir item</button>

            {/* TOTALES */}
            <div style={totalesBox}>
                {successMsg && (
                    <div style={{ padding: 12, background: '#e6ffed', border: '1px solid #b8f1c8', borderRadius: 6, marginBottom: 12 }}>
                        {successMsg}
                    </div>
                )}
                <p>Subtotal <b>${totales.subtotal.toFixed(2)}</b></p>
                <p>IVA 15% <b>${totales.iva.toFixed(2)}</b></p>
                <p>
                    Descuento
                    <input type="number" value={descuento}
                        onChange={e => setDescuento(Number(e.target.value))}
                        style={{ width: 80, textAlign: 'right' }} />
                </p>
                <p>
                    Forma de pago
                    <select style={{ width: '100%', padding: 8, marginTop: 6 }} value={metodoPagoSel} onChange={e => setMetodoPagoSel(Number(e.target.value))}>
                        <option value="">Seleccione forma de pago</option>
                        {metodosPago.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                </p>
                <hr />
                <h3>TOTAL ${totales.total.toFixed(2)}</h3>
                <button onClick={emitirFactura} style={btnEmitir}>EMITIR FACTURA</button>
            </div>
        </div>
    );
};

// ================== ESTILOS ==================
const container: CSSProperties = { maxWidth: 1100, margin: '40px auto', padding: 30 };
const grid2: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 };
const card: CSSProperties = { padding: 20, border: '1px solid #ddd', borderRadius: 8 };
const input: CSSProperties = { width: '100%', padding: 10, marginBottom: 10 };
const info: CSSProperties = { fontSize: 14 };
const table: CSSProperties = { width: '100%', marginTop: 30, borderCollapse: 'collapse' };
const th: CSSProperties = { padding: 12, background: '#f4f4f4', textAlign: 'left' };
const cell: CSSProperties = { width: '100%', padding: 8 };
const delBtn: CSSProperties = { border: 'none', background: 'none', color: 'red', cursor: 'pointer' };
const btnAdd: CSSProperties = { marginTop: 10, padding: '10px 15px', background: '#3498db' };
const totalesBox: CSSProperties = { marginTop: 30, maxWidth: 350, marginLeft: 'auto' };
const btnEmitir: CSSProperties = {
    width: '100%',
    padding: 14,
    background: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
};

export default NuevaFactura;
