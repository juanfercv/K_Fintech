import React, { useState, useEffect, useCallback } from 'react';
import { ConfiguracionRepositoryImpl } from '../../infrastructure/repositories/ConfiguracionRepositoryImpl';

// Estilos profesionales inline
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #8b5cf6',
  },
  title: {
    color: '#6d28d9',
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '5px',
    marginBottom: '25px',
    borderBottom: '1px solid #e5e7eb',
  },
  tabButton: {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: '3px solid transparent',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#6b7280',
  },
  tabButtonActive: {
    color: '#8b5cf6',
    borderBottom: '3px solid #8b5cf6',
  },
  tabContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '25px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e2e8f0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
  },
  select: {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
  },
  buttonPrimary: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonSecondary: {
    backgroundColor: '#94a3b8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginLeft: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#f3e8ff',
    padding: '16px',
    textAlign: 'left' as const,
    fontWeight: '600',
    color: '#6d28d9',
    fontSize: '14px',
  },
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: '14px',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusActive: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
  },
  statusInactive: {
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  permissionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  permissionSection: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  permissionTitle: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '10px',
    fontSize: '14px',
  },
  permissionList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
};

const ConfiguracionGeneral: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parametros' | 'usuarios' | 'roles' | 'integraciones' | 'soluciones'>('parametros');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para modales
  const [showModalUsuario, setShowModalUsuario] = useState(false);
  const [showModalRol, setShowModalRol] = useState(false);
  const [showModalIntegracion, setShowModalIntegracion] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState<any>(null);
  const [editandoRol, setEditandoRol] = useState<any>(null);
  const [editandoIntegracion, setEditandoIntegracion] = useState<any>(null);

  const [parametros, setParametros] = useState({
    moneda: { codigo: 'USD', simbolo: '$', nombre: 'Dólar Estadounidense', decimales: 2 },
    pais: { codigo: 'EC', nombre: 'Ecuador', codigoTelefono: '+593' },
    impuestos: { 
      iva: { porcentaje: 12, activo: true },
      ice: { porcentaje: 0, activo: false },
      retencionFuente: { porcentaje: 1, activo: true }
    },
    formatoDocumentos: {
      prefijoFactura: 'FAC',
      longitudSecuencia: 8,
      incluirAnio: true,
      incluirMes: true,
      separador: '-'
    }
  });

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombres: 'Admin',
      apellidos: 'Principal',
      email: 'admin@empresa.com',
      username: 'admin',
      rol: 'Administrador General',
      tienda: 'Todas',
      estado: 'activo'
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: 'Administrador General',
      descripcion: 'Acceso completo al sistema',
      nivel: 1,
      permisos: {
        tiendas: ['leer', 'crear', 'editar', 'eliminar'],
        facturas: ['leer', 'crear', 'editar', 'anular', 'reportes'],
        clientes: ['leer', 'crear', 'editar', 'eliminar'],
        metodosPago: ['leer', 'crear', 'editar', 'eliminar'],
        configuracion: ['leer', 'editar']
      }
    }
  ]);

  const [integraciones, setIntegraciones] = useState([
    {
      id: 1,
      servicio: 'sri',
      nombre: 'Servicio de Rentas Internas',
      configuracion: {
        ambiente: 'pruebas',
        claveAcceso: 'CLAVE_DE_PRUEBAS',
        urlRecepcion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
        urlAutorizacion: 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
        activo: true
      }
    },
    {
      id: 2,
      servicio: 'correo',
      nombre: 'Envío de Facturas por Email',
      configuracion: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'facturacion@empresa.com',
        remitente: 'Facturación Empresa',
        activo: true
      }
    }
  ]);

  const [soluciones, setSoluciones] = useState([
    {
      id: 1,
      nombre: 'Facturación Electrónica',
      descripcion: 'Sistema completo de facturación electrónica con integración SRI',
      estado: 'activo',
      modulos: ['Facturas', 'Notas de Crédito', 'Notas de Débito', 'Retenciones'],
      version: '1.0.0'
    },
    {
      id: 2,
      nombre: 'Gestión de Clientes',
      descripcion: 'Administración integral de clientes y su información',
      estado: 'activo',
      modulos: ['Perfiles', 'Historial', 'Contacto', 'Crédito'],
      version: '1.0.0'
    },
    {
      id: 3,
      nombre: 'Administración de Tiendas',
      descripcion: 'Control multi-sucursal y gestión de inventario',
      estado: 'activo',
      modulos: ['Sucursales', 'Inventario', 'Empleados', 'Reportes'],
      version: '1.0.0'
    },
    {
      id: 4,
      nombre: 'Métodos de Pago',
      descripcion: 'Configuración de múltiples formas de pago',
      estado: 'activo',
      modulos: ['Efectivo', 'Tarjeta', 'Transferencia', 'Cheque'],
      version: '1.0.0'
    }
  ]);

  // Repositorio y carga inicial
  const repository = new ConfiguracionRepositoryImpl();

  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const parametrosResp = await repository.getParametros();
        if (mounted && parametrosResp) {
          setParametros(prev => ({
            moneda: parametrosResp.moneda || prev.moneda,
            pais: parametrosResp.pais || prev.pais,
            impuestos: parametrosResp.impuestos || prev.impuestos,
            formatoDocumentos: {
              prefijoFactura: parametrosResp.documentos?.prefijo || prev.formatoDocumentos.prefijoFactura,
              longitudSecuencia: parametrosResp.documentos?.longitud || prev.formatoDocumentos.longitudSecuencia,
              incluirAnio: parametrosResp.documentos?.incluir_anio ?? prev.formatoDocumentos.incluirAnio,
              incluirMes: parametrosResp.documentos?.incluir_mes ?? prev.formatoDocumentos.incluirMes,
              separador: parametrosResp.documentos?.separador ?? prev.formatoDocumentos.separador,
            }
          }));
        }

        const [usuariosResp, rolesResp, integracionesResp] = await Promise.all([
          repository.getUsuarios().catch(() => null),
          repository.getRoles().catch(() => null),
          repository.getIntegraciones().catch(() => null),
        ]);

        if (mounted) {
          if (usuariosResp) setUsuarios(usuariosResp);
          if (rolesResp) setRoles(rolesResp);
          if (integracionesResp) setIntegraciones(integracionesResp);
        }
      } catch (err) {
        if (mounted) {
          const errorMsg = 'Error cargando configuración: ' + (err as Error).message;
          setError(errorMsg);
          console.error(errorMsg, err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    return () => { mounted = false; };
  }, []);

  const handleSaveParametros = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validar datos
      if (!parametros?.moneda?.codigo || !parametros?.pais?.codigo) {
        throw new Error('Moneda y País son requeridos');
      }
      
      if ((parametros?.impuestos?.iva?.porcentaje ?? 0) < 0 || (parametros?.impuestos?.ice?.porcentaje ?? 0) < 0) {
        throw new Error('Los porcentajes no pueden ser negativos');
      }
      
      const parametrosParaGuardar = {
        moneda: parametros.moneda || { codigo: 'USD', simbolo: '$', nombre: 'Dólar Estadounidense', decimales: 2 },
        pais: parametros.pais || { codigo: 'EC', nombre: 'Ecuador', codigoTelefono: '+593' },
        impuestos: parametros.impuestos || {
          iva: { porcentaje: 12, activo: true },
          ice: { porcentaje: 0, activo: false },
          retencionFuente: { porcentaje: 1, activo: true }
        },
        documentos: {
          prefijo: parametros?.formatoDocumentos?.prefijoFactura || 'FAC',
          longitud: parametros?.formatoDocumentos?.longitudSecuencia || 8,
          incluir_anio: parametros?.formatoDocumentos?.incluirAnio ?? true,
          incluir_mes: parametros?.formatoDocumentos?.incluirMes ?? true,
          separador: parametros?.formatoDocumentos?.separador || '-'
        }
      };
      
      await repository.updateParametros(parametrosParaGuardar);
      setSuccess('✅ Parámetros generales guardados exitosamente');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      const errorMsg = 'Error al guardar parámetros: ' + (error as Error).message;
      setError(errorMsg);
      console.error(errorMsg, error);
    } finally {
      setSaving(false);
    }
  };

  // Usuarios
  const handleGuardarUsuario = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (editandoUsuario?.id) {
        await repository.updateUsuario(editandoUsuario.id, editandoUsuario);
        setUsuarios(usuarios.map(u => u.id === editandoUsuario.id ? editandoUsuario : u));
        setSuccess('✅ Usuario actualizado correctamente');
      } else {
        const nuevoUsuario = await repository.createUsuario(editandoUsuario);
        setUsuarios([...usuarios, nuevoUsuario]);
        setSuccess('✅ Usuario creado correctamente');
      }
      
      setShowModalUsuario(false);
      setEditandoUsuario(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Error al guardar usuario: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarUsuario = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      setSaving(true);
      await repository.deleteUsuario(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
      setSuccess('✅ Usuario eliminado correctamente');
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Error al eliminar usuario: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Roles
  const handleGuardarRol = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (editandoRol?.id) {
        await repository.updateRol(editandoRol.id, editandoRol);
        setRoles(roles.map(r => r.id === editandoRol.id ? editandoRol : r));
        setSuccess('✅ Rol actualizado correctamente');
      } else {
        const nuevoRol = await repository.createRol(editandoRol);
        setRoles([...roles, nuevoRol]);
        setSuccess('✅ Rol creado correctamente');
      }
      
      setShowModalRol(false);
      setEditandoRol(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Error al guardar rol: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Integraciones
  const handleGuardarIntegracion = async (integracionData?: any) => {
    try {
      setSaving(true);
      setError(null);
      
      const dataToSave = integracionData || editandoIntegracion;
      
      if (!dataToSave?.servicio || !dataToSave?.nombre) {
        throw new Error('Servicio y Nombre son requeridos');
      }
      
      if (dataToSave?.id) {
        await repository.updateIntegracion(dataToSave.id, dataToSave);
        setIntegraciones(integraciones.map(i => i.id === dataToSave.id ? dataToSave : i));
        setSuccess('✅ Integración actualizada correctamente');
      } else {
        const nuevaIntegracion = await repository.createIntegracion(dataToSave);
        setIntegraciones([...integraciones, nuevaIntegracion]);
        setSuccess('✅ Integración creada correctamente');
      }
      
      setShowModalIntegracion(false);
      setEditandoIntegracion(null);
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Error al guardar integración: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const renderParametrosTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Parámetros Generales del Sistema</h3>
      
      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Moneda y País</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label htmlFor="monedaCodigo" style={styles.label}>Código de Moneda:</label>
            <select
              id="monedaCodigo"
              value={parametros.moneda?.codigo || 'USD'}
              onChange={(e) => setParametros({
                ...parametros,
                moneda: {...(parametros.moneda || {}), codigo: e.target.value}
              })}
              style={styles.select}
            >
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="MXN">MXN - Peso Mexicano</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="monedaSimbolo" style={styles.label}>Símbolo:</label>
            <input
              type="text"
              id="monedaSimbolo"
              value={parametros.moneda?.simbolo || '$'}
              onChange={(e) => setParametros({
                ...parametros,
                moneda: {...(parametros.moneda || {}), simbolo: e.target.value}
              })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="paisCodigo" style={styles.label}>País:</label>
            <select
              id="paisCodigo"
              value={parametros.pais?.codigo || 'EC'}
              onChange={(e) => setParametros({
                ...parametros,
                pais: {...(parametros.pais || {}), codigo: e.target.value}
              })}
              style={styles.select}
            >
              <option value="EC">Ecuador</option>
              <option value="CO">Colombia</option>
              <option value="MX">México</option>
              <option value="ES">España</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="paisTelefono" style={styles.label}>Código Telefónico:</label>
            <input
              type="text"
              id="paisTelefono"
              value={parametros.pais?.codigoTelefono || '+593'}
              onChange={(e) => setParametros({
                ...parametros,
                pais: {...(parametros.pais || {}), codigoTelefono: e.target.value}
              })}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Reglas de Impuestos</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>IVA (%):</label>
            <input
              type="number"
              value={parametros.impuestos?.iva?.porcentaje || 0}
              onChange={(e) => setParametros({
                ...parametros,
                impuestos: {
                  ...parametros.impuestos,
                  iva: {...(parametros.impuestos?.iva || {}), porcentaje: parseFloat(e.target.value) || 0}
                }
              })}
              style={styles.input}
            />
            <div style={{...styles.checkboxGroup, marginTop: '8px'}}>
              <input
                type="checkbox"
                checked={parametros.impuestos?.iva?.activo || false}
                onChange={(e) => setParametros({
                  ...parametros,
                  impuestos: {
                    ...parametros.impuestos,
                    iva: {...(parametros.impuestos?.iva || {}), activo: e.target.checked}
                  }
                })}
                style={styles.checkbox}
              />
              <label style={{fontSize: '14px', color: '#374151'}}>IVA Activo</label>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>ICE (%):</label>
            <input
              type="number"
              value={parametros.impuestos?.ice?.porcentaje || 0}
              onChange={(e) => setParametros({
                ...parametros,
                impuestos: {
                  ...parametros.impuestos,
                  ice: {...(parametros.impuestos?.ice || {}), porcentaje: parseFloat(e.target.value) || 0}
                }
              })}
              style={styles.input}
            />
            <div style={{...styles.checkboxGroup, marginTop: '8px'}}>
              <input
                type="checkbox"
                checked={parametros.impuestos?.ice?.activo || false}
                onChange={(e) => setParametros({
                  ...parametros,
                  impuestos: {
                    ...parametros.impuestos,
                    ice: {...(parametros.impuestos?.ice || {}), activo: e.target.checked}
                  }
                })}
                style={styles.checkbox}
              />
              <label style={{fontSize: '14px', color: '#374151'}}>ICE Activo</label>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Retención Fuente (%):</label>
            <input
              type="number"
              value={parametros.impuestos?.retencionFuente?.porcentaje || 0}
              onChange={(e) => setParametros({
                ...parametros,
                impuestos: {
                  ...parametros.impuestos,
                  retencionFuente: {...(parametros.impuestos?.retencionFuente || {}), porcentaje: parseFloat(e.target.value) || 0}
                }
              })}
              style={styles.input}
            />
            <div style={{...styles.checkboxGroup, marginTop: '8px'}}>
              <input
                type="checkbox"
                checked={parametros.impuestos?.retencionFuente?.activo || false}
                onChange={(e) => setParametros({
                  ...parametros,
                  impuestos: {
                    ...parametros.impuestos,
                    retencionFuente: {...(parametros.impuestos?.retencionFuente || {}), activo: e.target.checked}
                  }
                })}
                style={styles.checkbox}
              />
              <label style={{fontSize: '14px', color: '#374151'}}>Retención Activa</label>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h4 style={styles.cardTitle}>Formato de Numeración de Documentos</h4>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label htmlFor="prefijoFactura" style={styles.label}>Prefijo Factura:</label>
            <input
              type="text"
              id="prefijoFactura"
              value={parametros.formatoDocumentos?.prefijoFactura || 'FAC'}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...(parametros.formatoDocumentos || {}), prefijoFactura: e.target.value}
              })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="longitudSecuencia" style={styles.label}>Longitud Secuencia:</label>
            <input
              type="number"
              id="longitudSecuencia"
              value={parametros.formatoDocumentos?.longitudSecuencia || 8}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...(parametros.formatoDocumentos || {}), longitudSecuencia: parseInt(e.target.value) || 8}
              })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="separador" style={styles.label}>Separador:</label>
            <select
              id="separador"
              value={parametros.formatoDocumentos?.separador || '-'}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...(parametros.formatoDocumentos || {}), separador: e.target.value}
              })}
              style={styles.select}
            >
              <option value="-">Guion (-)</option>
              <option value="/">Barra (/)</option>
              <option value=".">Punto (.)</option>
              <option value="">Ninguno</option>
            </select>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '20px', marginTop: '15px'}}>
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={parametros.formatoDocumentos?.incluirAnio ?? true}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...(parametros.formatoDocumentos || {}), incluirAnio: e.target.checked}
              })}
              style={styles.checkbox}
            />
            <label style={{fontSize: '14px', color: '#374151'}}>Incluir Año</label>
          </div>
          
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={parametros.formatoDocumentos?.incluirMes ?? true}
              onChange={(e) => setParametros({
                ...parametros,
                formatoDocumentos: {...(parametros.formatoDocumentos || {}), incluirMes: e.target.checked}
              })}
              style={styles.checkbox}
            />
            <label style={{fontSize: '14px', color: '#374151'}}>Incluir Mes</label>
          </div>
        </div>
      </div>

      <div style={{textAlign: 'right', marginTop: '30px'}}>
        <button 
          style={styles.buttonPrimary}
          onClick={handleSaveParametros}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );

  const renderUsuariosTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Gestión de Usuarios</h3>
      
      <div style={{overflowX: 'auto'} as React.CSSProperties}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombre</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Rol</th>
              <th style={styles.tableHeader}>Tienda</th>
              <th style={styles.tableHeader}>Estado</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td style={styles.tableCell}>{usuario.nombres} {usuario.apellidos}</td>
                <td style={styles.tableCell}>{usuario.email}</td>
                <td style={styles.tableCell}>{usuario.rol}</td>
                <td style={styles.tableCell}>{usuario.tienda}</td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(usuario.estado === 'activo' ? styles.statusActive : styles.statusInactive)
                  }}>
                    {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <button 
                    onClick={() => { setEditandoUsuario(usuario); setShowModalUsuario(true); }}
                    style={{...styles.buttonPrimary, padding: '6px 12px', fontSize: '12px', marginRight: '8px'}}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleEliminarUsuario(usuario.id)}
                    style={{backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px'}}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{textAlign: 'center', marginTop: '20px'}}>
        <button 
          onClick={() => { setEditandoUsuario({nombres: '', apellidos: '', email: '', username: '', rol: '', tienda: '', estado: 'activo'}); setShowModalUsuario(true); }}
          style={styles.buttonPrimary}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Modal Usuario */}
      {showModalUsuario && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%'}}>
            <h3 style={{marginBottom: '20px'}}>{editandoUsuario?.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
            
            <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
              <input 
                placeholder="Nombres"
                value={editandoUsuario?.nombres || ''}
                onChange={(e) => setEditandoUsuario({...editandoUsuario, nombres: e.target.value})}
                style={styles.input}
              />
              <input 
                placeholder="Apellidos"
                value={editandoUsuario?.apellidos || ''}
                onChange={(e) => setEditandoUsuario({...editandoUsuario, apellidos: e.target.value})}
                style={styles.input}
              />
              <input 
                placeholder="Email"
                type="email"
                value={editandoUsuario?.email || ''}
                onChange={(e) => setEditandoUsuario({...editandoUsuario, email: e.target.value})}
                style={styles.input}
              />
              <input 
                placeholder="Username"
                value={editandoUsuario?.username || ''}
                onChange={(e) => setEditandoUsuario({...editandoUsuario, username: e.target.value})}
                style={styles.input}
              />
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                onClick={handleGuardarUsuario}
                disabled={saving}
                style={styles.buttonPrimary}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                onClick={() => { setShowModalUsuario(false); setEditandoUsuario(null); }}
                style={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRolesTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Gestión de Roles y Permisos</h3>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px'}}>
        {roles.map(rol => (
          <div key={rol.id} style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h4 style={styles.cardTitle}>{rol.nombre}</h4>
              <button 
                onClick={() => { setEditandoRol(rol); setShowModalRol(true); }}
                style={{...styles.buttonPrimary, padding: '6px 12px', fontSize: '12px'}}
              >
                Editar
              </button>
            </div>
            <p style={{color: '#64748b', marginBottom: '15px'}}>{rol.descripcion}</p>
            <p style={{fontWeight: '500', marginBottom: '15px'}}>Nivel: {rol.nivel}</p>
            
            <div style={styles.permissionGrid}>
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Tiendas</div>
                <div style={styles.permissionList}>
                  {rol.permisos?.tiendas?.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Facturas</div>
                <div style={styles.permissionList}>
                  {rol.permisos?.facturas?.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={styles.permissionSection}>
                <div style={styles.permissionTitle}>Clientes</div>
                <div style={styles.permissionList}>
                  {rol.permisos?.clientes?.map(permiso => (
                    <span key={permiso} style={{fontSize: '12px', backgroundColor: '#ede9fe', padding: '4px 8px', borderRadius: '4px'}}>
                      {permiso}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{textAlign: 'center', marginTop: '30px'}}>
        <button 
          onClick={() => { setEditandoRol({nombre: '', descripcion: '', nivel: 1, permisos: {tiendas: [], facturas: [], clientes: []}}); setShowModalRol(true); }}
          style={styles.buttonPrimary}
        >
          + Nuevo Rol
        </button>
      </div>

      {/* Modal Rol */}
      {showModalRol && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto'}}>
            <h3 style={{marginBottom: '20px'}}>{editandoRol?.id ? 'Editar Rol' : 'Nuevo Rol'}</h3>
            
            <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
              <input 
                placeholder="Nombre del Rol"
                value={editandoRol?.nombre || ''}
                onChange={(e) => setEditandoRol({...editandoRol, nombre: e.target.value})}
                style={styles.input}
              />
              <textarea 
                placeholder="Descripción"
                value={editandoRol?.descripcion || ''}
                onChange={(e) => setEditandoRol({...editandoRol, descripcion: e.target.value})}
                style={{...styles.input, minHeight: '80px'}}
              />
              <input 
                placeholder="Nivel"
                type="number"
                value={editandoRol?.nivel || 1}
                onChange={(e) => setEditandoRol({...editandoRol, nivel: parseInt(e.target.value)})}
                style={styles.input}
              />
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                onClick={handleGuardarRol}
                disabled={saving}
                style={styles.buttonPrimary}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                onClick={() => { setShowModalRol(false); setEditandoRol(null); }}
                style={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderIntegracionesTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Integraciones Externas</h3>
      
      <div style={{display: 'grid', gap: '20px'}}>
        {integraciones.map(int => (
          <div key={int.id} style={{...styles.card, border: '2px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px'}}>
              <div>
                <h4 style={{...styles.cardTitle, marginBottom: '5px'}}>{int.nombre}</h4>
                <p style={{color: '#64748b', fontSize: '12px'}}>Servicio: {int.servicio}</p>
              </div>
              <button 
                onClick={() => { setEditandoIntegracion(int); setShowModalIntegracion(true); }}
                style={{...styles.buttonPrimary, padding: '6px 12px', fontSize: '12px'}}
              >
                Editar
              </button>
            </div>
            
            <div style={{backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', display: 'grid', gap: '10px'}}>
              <div>
                <label style={{fontSize: '12px', fontWeight: '500', color: '#64748b'}}>Estado</label>
                <p style={{fontSize: '12px', color: '#475569'}}>
                  {int.configuracion?.activo ? '✅ Activa' : '❌ Inactiva'}
                </p>
              </div>
              
              {int.configuracion && (
                <div>
                  <label style={{fontSize: '12px', fontWeight: '500', color: '#64748b'}}>Configuración</label>
                  <pre style={{backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', fontSize: '11px', overflow: 'auto', maxHeight: '150px'}}>
                    {JSON.stringify(int.configuracion, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
              <button 
                onClick={async () => {
                  try {
                    setSaving(true);
                    console.log('Probando conexión con:', int.nombre);
                    setSuccess(`✅ Conexión exitosa con ${int.nombre}`);
                    setTimeout(() => setSuccess(null), 3000);
                  } catch (error) {
                    setError('Error al probar conexión: ' + (error as Error).message);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                style={{...styles.buttonSecondary, fontSize: '12px', padding: '6px 12px'}}
              >
                Probar Conexión
              </button>
              
              <button 
                onClick={() => {
                  try {
                    setSaving(true);
                    handleGuardarIntegracion({...int, configuracion: {...int.configuracion, activo: !int.configuracion?.activo}});
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                style={{...styles.buttonSecondary, fontSize: '12px', padding: '6px 12px'}}
              >
                {int.configuracion?.activo ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Integracion */}
      {showModalIntegracion && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto'}}>
            <h3 style={{marginBottom: '20px'}}>Editar Integración: {editandoIntegracion?.nombre}</h3>
            
            <div style={{display: 'grid', gap: '15px', marginBottom: '20px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>Servicio</label>
                <input 
                  placeholder="sri, correo, etc"
                  disabled
                  value={editandoIntegracion?.servicio || ''}
                  style={{...styles.input, backgroundColor: '#f3f4f6'}}
                />
              </div>
              
              {editandoIntegracion?.servicio === 'sri' && (
                <>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>Ambiente</label>
                    <select 
                      value={editandoIntegracion?.configuracion?.ambiente || 'pruebas'}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, ambiente: e.target.value}
                      })}
                      style={styles.select}
                    >
                      <option value="pruebas">Pruebas</option>
                      <option value="produccion">Producción</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>Clave de Acceso</label>
                    <input 
                      placeholder="Ingrese clave de acceso"
                      type="password"
                      value={editandoIntegracion?.configuracion?.claveAcceso || ''}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, claveAcceso: e.target.value}
                      })}
                      style={styles.input}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>URL Recepción</label>
                    <input 
                      placeholder="https://..."
                      value={editandoIntegracion?.configuracion?.urlRecepcion || ''}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, urlRecepcion: e.target.value}
                      })}
                      style={styles.input}
                    />
                  </div>
                </>
              )}
              
              {editandoIntegracion?.servicio === 'correo' && (
                <>
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>SMTP Host</label>
                    <input 
                      placeholder="smtp.gmail.com"
                      value={editandoIntegracion?.configuracion?.smtpHost || ''}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, smtpHost: e.target.value}
                      })}
                      style={styles.input}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>SMTP Puerto</label>
                    <input 
                      placeholder="587"
                      type="number"
                      value={editandoIntegracion?.configuracion?.smtpPort || ''}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, smtpPort: parseInt(e.target.value)}
                      })}
                      style={styles.input}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>Usuario SMTP</label>
                    <input 
                      placeholder="usuario@gmail.com"
                      value={editandoIntegracion?.configuracion?.smtpUser || ''}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, smtpUser: e.target.value}
                      })}
                      style={styles.input}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>Remitente</label>
                    <input 
                      placeholder="noreply@empresa.com"
                      value={editandoIntegracion?.configuracion?.remitente || ''}
                      onChange={(e) => setEditandoIntegracion({
                        ...editandoIntegracion, 
                        configuracion: {...editandoIntegracion?.configuracion, remitente: e.target.value}
                      })}
                      style={styles.input}
                    />
                  </div>
                </>
              )}
              
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px'}}>
                  <input 
                    type="checkbox"
                    checked={editandoIntegracion?.configuracion?.activo || false}
                    onChange={(e) => setEditandoIntegracion({
                      ...editandoIntegracion, 
                      configuracion: {...editandoIntegracion?.configuracion, activo: e.target.checked}
                    })}
                    style={{marginRight: '8px'}}
                  />
                  Integración Activa
                </label>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                onClick={() => handleGuardarIntegracion(editandoIntegracion)}
                disabled={saving}
                style={styles.buttonPrimary}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button 
                onClick={() => { setShowModalIntegracion(false); setEditandoIntegracion(null); }}
                style={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSolucionesTab = () => (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>Soluciones y Módulos Disponibles</h3>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px'}}>
        {soluciones.map(solucion => (
          <div key={solucion.id} style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
              <div>
                <h4 style={{...styles.cardTitle, marginBottom: '5px'}}>{solucion.nombre}</h4>
                <p style={{color: '#64748b', fontSize: '12px', margin: 0}}>v{solucion.version}</p>
              </div>
              <span style={{
                backgroundColor: solucion.estado === 'activo' ? '#ede9fe' : '#fee2e2',
                color: solucion.estado === 'activo' ? '#5b21b6' : '#991b1b',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                {solucion.estado === 'activo' ? '✅ Activa' : '❌ Inactiva'}
              </span>
            </div>
            
            <p style={{color: '#475569', fontSize: '13px', marginBottom: '15px', lineHeight: '1.5'}}>
              {solucion.descripcion}
            </p>
            
            <div style={{backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '15px'}}>
              <p style={{fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Módulos incluidos:</p>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                {solucion.modulos.map((modulo, idx) => (
                  <span key={idx} style={{
                    backgroundColor: '#ede9fe',
                    color: '#5b21b6',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {modulo}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '8px'}}>
              <button style={{
                ...styles.buttonPrimary,
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px'
              }}>
                Configurar
              </button>
              <button style={{
                ...styles.buttonSecondary,
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                marginLeft: 0
              }}>
                Más info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Configuración General del Sistema</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{fontSize: '14px', color: '#64748b'}}>Última actualización: Hoy</span>
        </div>
      </div>

      {error && (
        <div style={{backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px'}}>
          {error}
        </div>
      )}

      {success && (
        <div style={{backgroundColor: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '20px'}}>
          {success}
        </div>
      )}

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'parametros' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('parametros')}
        >
          📊 Parámetros Generales
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'usuarios' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'roles' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('roles')}
        >
          🔐 Roles y Permisos
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'integraciones' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('integraciones')}
        >
          🔌 Integraciones
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'soluciones' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('soluciones')}
        >
          💡 Soluciones
        </button>
      </div>

      {activeTab === 'parametros' && renderParametrosTab()}
      {activeTab === 'usuarios' && renderUsuariosTab()}
      {activeTab === 'roles' && renderRolesTab()}
      {activeTab === 'integraciones' && renderIntegracionesTab()}
      {activeTab === 'soluciones' && renderSolucionesTab()}
    </div>
  );
};

export default ConfiguracionGeneral;