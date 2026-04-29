import React, { useState, useEffect } from 'react';
import { CardKPI } from '../../../shared/componentes/generales/Tarjetas/Tarjetas';
import { obtenerSalidasPendientesLogistica, limpiarAsignacionLogistica, asignarTransporteLogistica } from '../aplicacion/servicios';
import useAlertas from '../../../shared/estado/useAlertas';
import ModalConfirmar from '../../../shared/componentes/generales/ModalConfirmar/ModalConfirmar';

const ListaAprobadas = ({ onAsignar }) => {
    const { agregarAlerta } = useAlertas();
    const [salidas, setSalidas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState('todas');
    const [busqueda, setBusqueda] = useState('');
    const [filtroFacultad, setFiltroFacultad] = useState('');
    const [filtroPrograma, setFiltroPrograma] = useState('');
    const [expandidoId, setExpandidoId] = useState(null);
    const [recursoABorrar, setRecursoABorrar] = useState(null);

    const handleBorrarParcial = async () => {
        if (!recursoABorrar) return;
        setCargando(true);
        const { salida, index } = recursoABorrar;

        try {
            const empresas = salida.empresa_asignada.split(' + ');
            const conductores = salida.conductor_asignado.split(' + ');

            empresas.splice(index, 1);
            conductores.splice(index, 1);

            if (empresas.length === 0) {
                await limpiarAsignacionLogistica(salida.id);
                agregarAlerta("Asignación borrada por completo. Debes reasignar los cupos.", 'info');
            } else {
                // Detectar tipo correcto según lo que queda
                const quedaSoloFlotaPropia = empresas.every(e => 
                    e.trim().startsWith('Flota UPN') || conductores[empresas.indexOf(e)]?.trim() === 'Institucional'
                );
                const tipoRestante = quedaSoloFlotaPropia ? 'flota_propia' : 'contratado';
                
                const payload = {
                    salida_id: salida.id,
                    tipo_transporte: tipoRestante,
                    placa_o_empresa: empresas.join(' + '),
                    conductor_o_contacto: conductores.join(' + '),
                    costo_proyectado: salida.costo_estimado || 0,
                    capacidad_asignada: 0 // Se recalculará al reasignar correctamente
                };
                await asignarTransporteLogistica(payload);
                agregarAlerta("Recurso eliminado de la asignación. Revisa el panel para completar cupos.", 'info');
            }
            cargarSalidas();
        } catch (e) {
            agregarAlerta("Error al borrar recurso", 'error');
            setCargando(false);
        } finally {
            setRecursoABorrar(null);
        }
    };

    const toggleFila = (id) => {
        setExpandidoId(expandidoId === id ? null : id);
    };

    useEffect(() => {
        cargarSalidas();
    }, []);

    const cargarSalidas = () => {
        setCargando(true);
        obtenerSalidasPendientesLogistica()
            .then(data => {
                if (Array.isArray(data)) {
                    console.log('[DEBUG] Salidas logistica recibidas:', data.map(s => ({
                        id: s.id,
                        codigo: s.codigo,
                        estado: s.estado,
                        empresa_asignada: s.empresa_asignada,
                        conductor_asignado: s.conductor_asignado,
                    })));
                    setSalidas(data);
                }
                setCargando(false);
            })
            .catch(error => {
                console.error("Error obteniendo salidas logísticas:", error);
                setCargando(false);
            });
    };

    const metricas = {
        total: salidas.length,
        pendientes: salidas.filter(s => s.estado !== 'lista_ejecucion').length,
        asignadas: salidas.filter(s => s.estado === 'lista_ejecucion').length,
        urbanas: salidas.filter(s => s.categoria === 'urbana').length,
        regionales: salidas.filter(s => s.categoria === 'regional').length,
    };

    // Listas dinámicas para filtros en cascada
    const facultades = [...new Set(salidas.map(s => s.facultad).filter(Boolean))].sort();
    const programasDeFacultad = [...new Set(
        salidas
            .filter(s => !filtroFacultad || s.facultad === filtroFacultad)
            .map(s => s.programa)
            .filter(Boolean)
    )].sort();

    const handleFacultadChange = (e) => {
        setFiltroFacultad(e.target.value);
        setFiltroPrograma('');
    };

    const salidasFiltradas = salidas.filter(s => {
        const matchFacultad = !filtroFacultad || s.facultad === filtroFacultad;
        const matchPrograma = !filtroPrograma || s.programa === filtroPrograma;
        const matchBusqueda = !busqueda || (
            (s.codigo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
            (s.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
            (s.asignatura || '').toLowerCase().includes(busqueda.toLowerCase())
        );
        return matchFacultad && matchPrograma && matchBusqueda;
    });

    return (
        <div>
            {/* Header del panel */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px' }}>Salidas por Asignar</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Salidas con aprobación del Consejo esperando gestión logística.</p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <CardKPI 
                    label="Total en Gestión" 
                    value={cargando ? '-' : metricas.total} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} 
                    iconBg="#eff6ff" iconColor="#3b82f6" 
                />
                <CardKPI 
                    label="Por Asignar" 
                    value={cargando ? '-' : metricas.pendientes} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
                    iconBg="#fffbeb" iconColor="#f59e0b" 
                />
                <CardKPI 
                    label="Transporte Asignado" 
                    value={cargando ? '-' : metricas.asignadas} 
                    icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                    iconBg="#ecfdf5" iconColor="#10b981" 
                />
            </div>

            {/* Filtros Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {/* Buscador */}
                <div style={{ position: 'relative', width: '280px' }}>
                    <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input 
                        type="text" 
                        placeholder="Buscar por código, programa o asignatura..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Dropdown Facultad */}
                <select 
                    value={filtroFacultad}
                    onChange={handleFacultadChange}
                    style={{ padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: '8px', height: '40px', fontSize: '13px', color: filtroFacultad ? '#0f172a' : '#94a3b8', outline: 'none', background: 'white', cursor: 'pointer' }}
                >
                    <option value="">Todas las Facultades</option>
                    {facultades.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>

                {/* Dropdown Programa (en cascada con Facultad) */}
                <select 
                    value={filtroPrograma}
                    onChange={(e) => setFiltroPrograma(e.target.value)}
                    disabled={programasDeFacultad.length === 0}
                    style={{ padding: '0 12px', border: '1px solid #e2e8f0', borderRadius: '8px', height: '40px', fontSize: '13px', color: filtroPrograma ? '#0f172a' : '#94a3b8', outline: 'none', background: 'white', cursor: programasDeFacultad.length === 0 ? 'not-allowed' : 'pointer', opacity: programasDeFacultad.length === 0 ? 0.5 : 1 }}
                >
                    <option value="">Todos los Programas</option>
                    {programasDeFacultad.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                {/* Botón limpiar filtros */}
                {(filtroFacultad || filtroPrograma || busqueda) && (
                    <button
                        onClick={() => { setFiltroFacultad(''); setFiltroPrograma(''); setBusqueda(''); }}
                        title="Limpiar filtros"
                        style={{ 
                            height: '40px', 
                            padding: '0 16px', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0', 
                            background: '#f8fafc', 
                            color: '#475569', 
                            fontSize: '13px', 
                            fontWeight: '500', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Tabla */}
            <div className="herr-tabla-wrapper">
                {cargando ? (
                    <div className="herr-vacio">Cargando datos logísticos...</div>
                ) : salidasFiltradas.length === 0 ? (
                    <div className="herr-vacio">No hay salidas pendientes de asignación.</div>
                ) : (
                    <table className="herr-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Facultad</th>
                                <th>Categoría</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salidasFiltradas.map(s => {
                                const isExpanded = expandidoId === s.id;
                                const yaAsignada = s.estado === 'lista_ejecucion' || !!s.empresa_asignada;
                                const totalPax = (s.num_estudiantes || 0) + (s.num_docentes || 0);
                                // Si capacidad_asignada es null/undefined/0 pero ya hay empresa = registro pre-migración = incompleto
                                const capAsignada = (s.capacidad_asignada != null) ? Number(s.capacidad_asignada) : 0;
                                const esIncompleta = yaAsignada && (capAsignada === 0 || capAsignada < totalPax);
                                const costoFormateado = s.costo_estimado ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(s.costo_estimado) : '$ 0';
                                
                                return (
                                    <React.Fragment key={s.id}>
                                        <tr 
                                            style={{ 
                                                borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', 
                                                background: isExpanded ? '#fafaf9' : (esIncompleta ? '#fffbeb' : yaAsignada ? '#f0fdf4' : 'transparent'),
                                                transition: 'background 0.2s ease', 
                                                cursor: 'pointer' 
                                            }} 
                                            onClick={() => toggleFila(s.id)}
                                        >
                                            <td>
                                                <code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontSize: 12 }}>
                                                    {s.codigo}
                                                </code>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{s.nombre}</div>
                                            </td>
                                            <td>{s.facultad}</td>
                                            <td>
                                                <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                                    {s.categoria ? s.categoria.toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                {esIncompleta ? (
                                                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                        Incompleto
                                                    </span>
                                                ) : yaAsignada ? (
                                                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                        ✓ Asignado
                                                    </span>
                                                ) : (
                                                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                                        Pendiente
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="herr-acciones">
                                                    <button 
                                                        className="herr-action-circle" 
                                                        title={yaAsignada ? 'Ver / Reasignar' : 'Asignar Recursos'}
                                                        onClick={(e) => { e.stopPropagation(); onAsignar?.(s); }}
                                                        style={{ 
                                                            color: esIncompleta ? '#d97706' : yaAsignada ? '#10b981' : '#0ea5e9', 
                                                            borderColor: esIncompleta ? '#fde68a' : yaAsignada ? '#d1fae5' : '#e0f2fe', 
                                                            background: esIncompleta ? '#fffbeb' : yaAsignada ? '#f0fdf4' : '#f0f9ff' 
                                                        }}
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                            {yaAsignada 
                                                                ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                                                                : <><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></>}
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        className="herr-btn herr-btn--ghost herr-btn--sm"
                                                        onClick={(e) => { e.stopPropagation(); onAsignar?.(s); }}
                                                        style={yaAsignada ? { color: '#15803d', borderColor: '#86efac' } : {}}
                                                    >
                                                        {yaAsignada ? 'Reasignar' : 'Asignar'}
                                                    </button>
                                                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                                                        <svg style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="6 9 12 15 18 9"></polyline>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr style={{ background: '#fafaf9', borderBottom: '1px solid #e2e8f0' }}>
                                                <td colSpan="6" style={{ padding: '0 16px 16px 16px' }}>
                                                    <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 0.9fr) minmax(0, 0.7fr) minmax(0, 1.8fr)', gap: '16px', whiteSpace: 'normal', boxSizing: 'border-box' }}>
                                                        {/* Columna 1: Itinerario */}
                                                        <div style={{ overflow: 'hidden', minWidth: 0 }}>
                                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Itinerario</h4>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ color: '#64748b', fontSize: '13px', width: '80px', flexShrink: 0 }}>Destino:</span>
                                                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.destino || 'Múltiples destinos / Sin Definir'}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ color: '#64748b', fontSize: '13px', width: '80px', flexShrink: 0 }}>Salida:</span>
                                                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.fecha_inicio ? `${s.fecha_inicio} a las ${s.hora_inicio || '06:00'}` : 'Por definir'}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                <span style={{ color: '#64748b', fontSize: '13px', width: '80px', flexShrink: 0 }}>Llegada:</span>
                                                                <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.fecha_fin ? `${s.fecha_fin} a las ${s.hora_fin || '18:00'}` : 'Por definir'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Columna 2: Pasajeros */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden', minWidth: 0 }}>
                                                            <div>
                                                                <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Manifesto de Pasajeros</h4>
                                                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
                                                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{s.num_estudiantes || 0}</div>
                                                                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Estud.</div>
                                                                    </div>
                                                                    <div style={{ width: '1px', height: '30px', background: '#e2e8f0', flexShrink: 0 }}></div>
                                                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>{s.num_docentes || 0}</div>
                                                                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Doc.</div>
                                                                    </div>
                                                                    <div style={{ width: '1px', height: '30px', background: '#e2e8f0', flexShrink: 0 }}></div>
                                                                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', flexShrink: 0 }}>
                                                                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>{(s.num_estudiantes || 0) + (s.num_docentes || 0)}</div>
                                                                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>Total Pax.</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Columna 3: Resumen Estratégico */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <div>
                                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Resumen Estratégico</h4>
                                                                
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Distancia:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.distancia_km || 0} km</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Duración:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.duracion_dias || 1} días</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Viaje Aprox:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.horas_viaje || 0} horas</span>
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                    <span style={{ color: '#64748b', fontSize: '13px', width: '90px', flexShrink: 0 }}>Viáticos Aprox:</span>
                                                                    <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{s.viaticos_estimados ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(s.viaticos_estimados) : '$ 0'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Columna 4: Asignación */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <div>
                                                                {yaAsignada && (s.empresa_asignada || s.conductor_asignado) ? (() => {
                                                                    const totalPax = (s.num_estudiantes || 0) + (s.num_docentes || 0);
                                                                    const capAsignada = (s.capacidad_asignada != null) ? Number(s.capacidad_asignada) : 0;
                                                                    const esIncompleta = capAsignada === 0 || capAsignada < totalPax;
                                                                    const bordeEstado = esIncompleta ? '#f59e0b' : '#10b981';
                                                                    const bgEstado = esIncompleta ? '#fffbeb' : '#f8fafc';
                                                                    const textoEstado = esIncompleta ? `CUPOS INCOMPLETOS (${capAsignada}/${totalPax})` : 'CONFIRMADA';
                                                                    const iconColor = esIncompleta ? '#d97706' : '#10b981';
                                                                    
                                                                    return (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: esIncompleta ? '#ea580c' : '#10b981', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                                {esIncompleta ? (
                                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                                                ) : (
                                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                                                )}
                                                                                {textoEstado}
                                                                            </div>
                                                                            <div style={{ color: '#0f172a', fontSize: '15px', fontWeight: '800' }}>
                                                                                {costoFormateado}
                                                                            </div>
                                                                        </div>

                                                                        {/* Encabezado de columnas */}
                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr 1fr 28px', gap: '6px', padding: '0 10px 4px', alignItems: 'center' }}>
                                                                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Empresa</span>
                                                                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Placa</span>
                                                                            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Conductor</span>
                                                                            <span></span>
                                                                        </div>

                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                            {s.empresa_asignada?.split(' + ').flatMap((emp, i) => {
                                                                                const conds = s.conductor_asignado?.split(' + ') || [];
                                                                                const empTrimmed = emp.trim();
                                                                                
                                                                                // Parsear nombre y placa del string guardado
                                                                                let nombreEmpresa = empTrimmed;
                                                                                let placaVehiculoRaw = '—';
                                                                                const matchFlota = empTrimmed.match(/^Flota UPN \((.+)\)$/);
                                                                                const matchContratado = empTrimmed.match(/^(.+?)\s*\(Placa:\s*(.+)\)$/);
                                                                                if (matchFlota) {
                                                                                    nombreEmpresa = 'Flota UPN';
                                                                                    placaVehiculoRaw = matchFlota[1]; // "ADFA / GJGJH"
                                                                                } else if (matchContratado) {
                                                                                    nombreEmpresa = matchContratado[1].trim();
                                                                                    placaVehiculoRaw = matchContratado[2].trim();
                                                                                }

                                                                                // Separar si hay múltiples placas (" / ")
                                                                                const placas = placaVehiculoRaw.split(' / ').map(p => p.trim());
                                                                                const conductorBase = conds[i]?.trim() || '—';

                                                                                return placas.map((placaIndiv, indexPlaca) => (
                                                                                    <div key={`${i}-${indexPlaca}`} style={{ 
                                                                                        display: 'grid', gridTemplateColumns: '1fr 0.7fr 1fr 28px', gap: '6px', alignItems: 'center', 
                                                                                        background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', 
                                                                                        border: '1px solid #e2e8f0', transition: 'all 0.15s ease'
                                                                                    }}
                                                                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f1f5f9'; }}
                                                                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                                                                                    >
                                                                                        {/* Columna 1: Empresa */}
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
                                                                                            <svg style={{ flexShrink: 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                                                                            <span title={nombreEmpresa} style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombreEmpresa}</span>
                                                                                        </div>

                                                                                        {/* Columna 2: Placa */}
                                                                                        <div style={{ overflow: 'hidden' }}>
                                                                                            <span title={placaIndiv} style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{placaIndiv}</span>
                                                                                        </div>

                                                                                        {/* Columna 3: Conductor */}
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
                                                                                            <svg style={{ flexShrink: 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                                                            <span title={conductorBase} style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conductorBase}</span>
                                                                                        </div>

                                                                                        {/* Botón eliminar */}
                                                                                        <button 
                                                                                            title="Quitar recurso"
                                                                                            onClick={() => setRecursoABorrar({ salida: s, index: i, nombre: emp.trim() })}
                                                                                            style={{ 
                                                                                                background: '#fee2e2', border: 'none', cursor: 'pointer', color: '#ef4444', 
                                                                                                width: '26px', height: '26px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                                transition: 'background 0.15s ease', flexShrink: 0
                                                                                            }}
                                                                                            onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                                                                                            onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                                                        >
                                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                                                        </button>
                                                                                    </div>
                                                                                ));
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                ); })() : (
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', height: '100%', justifyContent: 'center' }}>
                                                                        <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.02em' }}>Costo Proyectado</span>
                                                                        <span style={{ color: '#0f172a', fontSize: '18px', fontWeight: '800' }}>{costoFormateado}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Modal de Confirmación */}
            {recursoABorrar && (
                <ModalConfirmar
                    titulo="¿Quitar Recurso?"
                    descripcion={`Estás a punto de quitar "${recursoABorrar.nombre}" de la asignación. Los demás recursos se mantendrán.`}
                    labelConfirmar="Sí, quitar recurso"
                    labelCancelar="Cancelar"
                    onConfirmar={handleBorrarParcial}
                    onCancelar={() => setRecursoABorrar(null)}
                    tipo="peligro"
                    cargando={cargando}
                />
            )}
        </div>
    );
};

export default ListaAprobadas;
