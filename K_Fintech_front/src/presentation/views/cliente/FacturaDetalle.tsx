import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const VerFactura: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/facturas/${id}`)
            .then(res => res.json())
            .then(data => {
                setFactura(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const centerText: React.CSSProperties = { textAlign: 'center' };

    if (loading) return <p style={centerText}>Cargando factura...</p>;
    if (!factura) return <p>No se pudo cargar la factura</p>;

    return (
        <div style={{
    maxWidth: '2000px',
    margin: '32px auto',
    padding: '40px',
    background: '#ffffff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    borderRadius: 10,
    border: '1px solid #e5e7eb'
}}>

            {/* BOTÓN VOLVER */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: 24,
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontSize: 15
                }}
            >
                ← Volver
            </button>

            {/* ENCABEZADO */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 24
            }}>
                <div>
                    <h2 style={{ margin: 0 }}>{factura.tienda?.nombreTienda}</h2>
                    <p style={{ margin: '6px 0' }}>{factura.tienda?.direccion_sucursal_tienda}</p>
                    <p style={{ margin: '6px 0' }}>RUC: {factura.tienda?.RUCTienda}</p>
                    <p style={{ margin: '6px 0' }}>Tel: {factura.tienda?.telefono}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0 }}>FACTURA</h2>
                    <p><b>N°:</b> {factura.idFactura}</p>
                    <p><b>Fecha:</b> {factura.fecha_emision}</p>
                    <p><b>Estado:</b> {factura.estado_factura}</p>
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

            {/* DATOS DEL CLIENTE */}
            <div style={{
                padding: 20,
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                background: '#f9fafb',
                marginBottom: 24
            }}>
                <h3 style={{ marginTop: 0 }}>Datos del Cliente</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 16
                }}>
                    <div><b>Nombre</b><div style={{ marginTop: 6 }}>{factura.cliente?.nombre_cliente || '—'}</div></div>
                    <div><b>Cédula</b><div style={{ marginTop: 6 }}>{factura.cliente?.cedula_cliente || '—'}</div></div>
                    <div><b>Correo</b><div style={{ marginTop: 6 }}>{factura.cliente?.correo_cliente || '—'}</div></div>
                    <div><b>Dirección</b><div style={{ marginTop: 6 }}>{factura.cliente?.direccion_cliente || '—'}</div></div>
                </div>
            </div>

            {/* DETALLE */}
            <h3>Detalle de la Factura</h3>

            <table
                width="100%"
                style={{
                    borderCollapse: 'collapse',
                    border: '1px solid #e5e7eb',
                    marginTop: 12,
                    fontSize: 15
                }}
            >
                <thead style={{ background: '#f3f4f6' }}>
                    <tr>
                        <th style={th}>Descripción</th>
                        <th style={th}>Cantidad</th>
                        <th style={th}>Precio Unit.</th>
                        <th style={th}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {factura.detalle_facturas?.map((d: any, index: number) => (
                        <tr key={index}>
                            <td style={td}>{d.descripcion}</td>
                            <td style={td}>{d.cantidad}</td>
                            <td style={td}>${d.precio_unitario}</td>
                            <td style={td}>${d.precio_total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTALES */}
            <div style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <div style={{ width: 340 }}>
                    <p style={totalRow}><span>Subtotal:</span><span>${factura.subtotal}</span></p>
                    <p style={totalRow}><span>IVA (15%):</span><span>${factura.iva}</span></p>
                    <hr style={{ margin: '12px 0' }} />
                    <h2 style={{ textAlign: 'right', margin: 0 }}>
                        TOTAL: ${factura.total}
                    </h2>
                </div>
            </div>

            {/* FORMA DE PAGO */}
            <div style={{ marginTop: 32 }}>
                <div style={{
                    padding: 20,
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    background: '#f9fafb'
                }}>
                    <h3 style={{ marginTop: 0 }}>Forma de pago</h3>
                    {(() => {
                        const mp =
                            factura.forma_pago ||
                            factura.formaPago ||
                            factura.forma ||
                            factura.metodo_pago ||
                            factura.metodoPago ||
                            null;

                        if (!mp) return <p>No registrada</p>;

                        return (
                            <div>
                                <p style={{ margin: '6px 0', fontWeight: 600 }}>
                                    {mp.nombre ?? mp.nombre_forma_pago ?? mp.id ?? 'Método'}
                                </p>
                                {mp.descripcion && (
                                    <p style={{ margin: '6px 0', color: '#555' }}>
                                        {mp.descripcion}
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

const th: React.CSSProperties = {
    padding: '14px',
    borderRight: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'left',
    background: '#f3f4f6',
    fontWeight: 600
};

const td: React.CSSProperties = {
    padding: '14px',
    borderRight: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    verticalAlign: 'top',
    lineHeight: 1.5
};

const totalRow: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '6px 0'
};

export default VerFactura;
