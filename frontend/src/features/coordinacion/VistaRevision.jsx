import React, { useState, useEffect } from 'react';
import RevisionPedagogicaPanel from './RevisionPedagogicaPanel';
import KanbanItinerario from '@/features/salidas/presentacion/componentes/pasos/KanbanItinerario/KanbanItinerario';
import MapaRuta from '@/features/salidas/presentacion/componentes/mapa/MapaRuta/MapaRuta';

const VistaRevision = ({ salida: salidaList, onVolver, PanelDerecho }) => {
    const [tabInfo, setTabInfo] = useState('general');
    const [salidaDetail, setSalidaDetail] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [tabKanban, setTabKanban] = useState('ida');
    const [paradaVer, setParadaVer] = useState(null);
    const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);

    useEffect(() => {
        if (!salidaList?.id) return;
        setIsLoadingDetail(true);
        fetch(`http://127.0.0.1:8000/api/admin/salidas/${salidaList.id}/`)
            .then(r => r.json())
            .then(data => {
                setSalidaDetail(data);
                setIsLoadingDetail(false);
            })
            .catch(e => {
                console.error("Error cargando detalle:", e);
                setIsLoadingDetail(false);
            });
    }, [salidaList?.id]);

    const salida = { ...salidaList, ...(salidaDetail || {}) };
    
    // Preparar puntos de ruta para KanbanItinerario (mockeando extremos para el .slice(1, -1))
    const puntosBaseReales = (salidaDetail?.puntos_ruta || []).map(p => ({
        ...p,
        lat: p.latitud,
        lng: p.longitud,
        fechaProgramada: p.fecha_programada,
        horaProgramada: p.hora_programada,
        notasItinerario: p.notas_itinerario
    }));
    
    const pRuta = puntosBaseReales.filter(p => !p.es_retorno);
    const pRetorno = puntosBaseReales.filter(p => p.es_retorno);
    const puntosRutaClean = [{}, ...pRuta, {}];
    const puntosRetornoClean = [{}, ...pRetorno, {}];

    const handleVerParada = (idx, esRetorno) => {
        const arr = esRetorno ? puntosRetornoClean : puntosRutaClean;
        if (arr[idx]) setParadaVer(arr[idx]);
    };

    // Layout de vista compartida (Pantalla completa o renderizado condicional en dashboard)
    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
                <button 
                    onClick={onVolver} 
                    style={{ 
                        background: '#fff', 
                        border: '1px solid #cbd5e1', 
                        borderRadius: '8px',
                        padding: '10px 16px',
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '14px', 
                        color: '#334155', 
                        fontWeight: '800',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    VOLVER AL TABLERO
                </button>
            </div>

            {/* Titulo Principal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>{salida?.nombre || 'Geología Estructural'}</h1>
                    <span style={{ background: '#0f172a', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {salida?.codigo || 'SAL-2024-0045'}
                    </span>
                </div>
                <div style={{ background: '#e2e8f0', color: '#475569', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    PENDIENTE CONCEPTO
                </div>
            </div>

            {/* Contenedor Dividido */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                
                {/* Lado Izquierdo: Información de la Salida */}
                <div style={{ flex: isChecklistExpanded ? '1 1 50%' : '1 1 65%', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'flex 0.3s ease-in-out' }}>
                    
                    {/* Tabs de Información */}
                    <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
                        {[
                            { id: 'general', label: 'Resumen Ficha Técnica' },
                            { id: 'itinerario', label: 'Itinerario' },
                            { id: 'presupuesto', label: 'Presupuesto' }
                        ].map(t => (
                            <div 
                                key={t.id}
                                onClick={() => setTabInfo(t.id)}
                                style={{ 
                                    cursor: 'pointer', 
                                    fontSize: '15px', 
                                    fontWeight: tabInfo === t.id ? 'bold' : 'normal',
                                    color: tabInfo === t.id ? '#0f172a' : '#94a3b8',
                                    position: 'relative'
                                }}
                            >
                                {t.label}
                                {tabInfo === t.id && (
                                    <div style={{ position: 'absolute', bottom: '-11px', left: 0, right: 0, height: '3px', background: '#0f172a' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contenido del Tab */}
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
                        {tabInfo === 'general' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.8fr) 1fr', gap: '40px' }}>
                                {/* Columna Izquierda: Lo Pedagógico completo */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>OBJETIVO GENERAL</h4>
                                        <p style={{ margin: 0, color: '#1e293b', fontSize: '16px', lineHeight: '1.6', fontWeight: '500' }}>
                                            {salida?.objetivo_general || salida?.resumen || 'El docente no especificó un objetivo para esta salida de campo.'}
                                        </p>
                                    </div>

                                    {salida?.objetivos_especificos && (
                                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '6px', borderLeft: '3px solid #6366f1' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>OBJETIVOS ESPECÍFICOS</h4>
                                            <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                                {salida.objetivos_especificos}
                                            </p>
                                        </div>
                                    )}

                                    <div style={{ padding: '0' }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>JUSTIFICACIÓN PEDAGÓGICA</h4>
                                        <p style={{ margin: 0, color: '#475569', fontSize: '15px', lineHeight: '1.7' }}>
                                            {salida?.justificacion || 'El profesor no ha proporcionado una justificación detallada para esta salida de campo.'}
                                        </p>
                                    </div>
                                    
                                    {salida?.estrategia_metodologica && (
                                        <div style={{ padding: '0' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>ESTRATEGIA METODOLÓGICA Y PRODUCTOS ESPERADOS</h4>
                                            <p style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                                {salida.estrategia_metodologica}
                                            </p>
                                            {salida?.productos_esperados && (
                                                <div style={{ display: 'inline-block', background: '#ecfdf5', color: '#065f46', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                                                    🎯 Producto Final: {salida.productos_esperados}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Columna Derecha: Ficha de Datos (Sobria y completa) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {/* Módulo Profesor */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(salida?.profesor_nombre || 'Docente')}&background=0D8ABC&color=fff&rounded=true&size=50`} 
                                            alt="Profesor"
                                            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #e2e8f0' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>PROFESOR RESPONSABLE</span>
                                            <span style={{ fontSize: '15px', color: '#0f172a', fontWeight: '600' }}>
                                                {salida?.profesor_nombre || `Docente (ID: ${salida?.profesor_id || 'N/A'})`}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>ASIGNATURA Y CÓDIGO</span>
                                        <span style={{ fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>{salida?.asignatura || 'Sin Asignatura'} <span style={{ color: '#64748b', fontWeight: 'normal' }}>({salida?.codigo || 'N/A'})</span></span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>PROGRAMA ACADÉMICO</span>
                                        <span style={{ fontSize: '14px', color: '#334155' }}>{salida?.programa || (salida?.programa_id ? `Programa ${salida.programa_id}` : 'No Definido')}</span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>PROYECCIÓN ESTUDIANTES</span>
                                            <span style={{ fontSize: '14px', color: '#334155' }}>{salida?.num_estudiantes || 0} Cupos Estimados</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'right' }}>
                                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>PERIODO (SEMESTRE)</span>
                                            <span style={{ fontSize: '14px', color: '#334155' }}>{salida?.semestre || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px' }}>CRONOGRAMA TENTATIVO</span>
                                        <span style={{ fontSize: '15px', color: '#0f172a', fontWeight: '500' }}>
                                            {salida?.fecha_inicio || 'Sin definir'} <span style={{ color: '#cbd5e1', margin: '0 8px' }}>—</span> {salida?.fecha_fin || 'Sin definir'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {tabInfo === 'itinerario' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>Itinerario Proyecto por el Profesor</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Puedes navegar el itinerario y hacer clic en las paradas para visualizar su programación detallada. La edición está bloqueada en esta vista.</p>
                                </div>
                                
                                {isLoadingDetail ? (
                                    <p style={{ color: '#64748b', fontSize: '15px' }}>Cargando itinerario enrutado desde la base de datos...</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                        {/* Mapa en la parte superior */}
                                        {/* Rutas en la parte superior (Reemplazo del Mapa interactivo) */}
                                        {/* Rutas en la parte superior (Reemplazo del Mapa interactivo) */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '20px' }}>
                                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                                    <div style={{ background: '#eff6ff', color: '#3b82f6', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>→</div>
                                                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', letterSpacing: '0.5px' }}>VIAJE DE IDA</span>
                                                </div>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>PUNTO DE PARTIDA</span>
                                                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                        <div style={{ background: '#1e293b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>A</div>
                                                        <span style={{ color: '#334155', fontSize: '14px' }}>{pRuta.length > 0 ? pRuta[0].nombre : (salida?.punto_partida || 'Sin definir')}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>DESTINO FINAL</span>
                                                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                        <div style={{ background: '#1e293b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>B</div>
                                                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>{pRuta.length > 0 ? pRuta[pRuta.length - 1].nombre : (salida?.parada_max || 'Sin definir')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                                    <div style={{ background: '#eff6ff', color: '#3b82f6', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(180deg)', fontWeight: 'bold' }}>→</div>
                                                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155', letterSpacing: '0.5px' }}>VIAJE DE RETORNO</span>
                                                </div>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>PUNTO DE PARTIDA (RETORNO)</span>
                                                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                        <div style={{ background: '#1e293b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>A</div>
                                                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>{pRetorno.length > 0 ? pRetorno[0].nombre : (salida?.parada_max || 'Sin definir')}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>DESTINO FINAL (RETORNO)</span>
                                                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                        <div style={{ background: '#1e293b', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>B</div>
                                                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>{pRetorno.length > 0 ? pRetorno[pRetorno.length - 1].nombre : (salida?.punto_partida || 'Sin definir')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dashboard métricas itinerario */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '10px' }}>
                                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '12px', borderRadius: '10px' }}>
                                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>RECORRIDO ESTRUCTURAL</div>
                                                    <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{salida?.distancia_total_km || 0} km</div>
                                                </div>
                                            </div>
                                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ background: '#fdf4ff', color: '#d946ef', padding: '12px', borderRadius: '10px' }}>
                                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TIEMPO EN RUTA</div>
                                                    <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{salida?.horas_viaje || 0} hrs</div>
                                                </div>
                                            </div>
                                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ background: '#ecfccb', color: '#65a30d', padding: '12px', borderRadius: '10px' }}>
                                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DURACIÓN GENERAL</div>
                                                    <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>{salida?.duracion_dias || 1} días</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Kanban en la parte inferior */}
                                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <KanbanItinerario 
                                                tabActivo={tabKanban}
                                                onCambiarTab={setTabKanban}
                                                puntosRuta={puntosRutaClean}
                                                puntosRetorno={puntosRetornoClean}
                                                fechaInicio={salida?.fecha_inicio || ''}
                                                onEditarParada={(idx) => handleVerParada(idx, false)}
                                                onNuevaParada={() => {}}
                                                onQuitarParada={() => {}}
                                                onQuitarParadaRetorno={() => {}}
                                                onMoverParada={() => {}}
                                                onMoverParadaRetorno={() => {}}
                                                onEditarParadaRetorno={(idx) => handleVerParada(idx, true)}
                                                isReadOnly={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {tabInfo === 'presupuesto' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>Desglose Presupuestal Solicitado</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Evaluación de los costos logísticos integrales requeridos para el desarrollo de la práctica.</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '1px' }}>COSTO TOTAL PROYECTADO</span>
                                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '8px 0' }}>
                                            ${(salida?.costo_estimado || 0).toLocaleString('es-CO')} COP
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Cálculo estimado basado en el itinerario completo.</p>
                                    </div>
                                </div>
                                <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', color: '#1e3a8a', fontSize: '14px', border: '1px solid #bfdbfe' }}>
                                    <span style={{ fontWeight: 'bold' }}>Nota:</span> Para esta versión académica, el centro de costos proyectado se resume en el componente global y los gastos de movilidad basados en los {salida?.duracion_dias || 1} días proyectados.
                                </div>
                            </div>
                        )}
                        {tabInfo !== 'general' && tabInfo !== 'itinerario' && tabInfo !== 'academicos' && tabInfo !== 'presupuesto' && (
                            <p style={{ color: '#64748b' }}>Contenido de {tabInfo} (Simulado para demostración)</p>
                        )}
                    </div>
                </div>

                {/* Lado Derecho: Lista de Chequeo (Componente reutilizado con diseño premium estático) */}
                <div style={{ flex: isChecklistExpanded ? '1 1 50%' : '1 1 35%', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transition: 'flex 0.3s ease-in-out' }}>
                    <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {PanelDerecho ? 'VERIFICACIÓN DE CONSEJO' : 'LISTA DE CHEQUEO'}
                            </h2>
                            <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '13px' }}>
                                {PanelDerecho ? 'Aprobación y autorización económica de la salida de campo.' : 'Aprobación y evaluación final de las condiciones logísticas y pedagógicas de esta ruta.'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsChecklistExpanded(!isChecklistExpanded)} 
                            title={isChecklistExpanded ? "Volver a vista normal" : "Expandir para evaluar mejor"}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: isChecklistExpanded ? '#e0e7ff' : '#f1f5f9', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '20px', 
                                cursor: 'pointer', 
                                fontSize: '13px', 
                                fontWeight: '700', 
                                color: isChecklistExpanded ? '#3730a3' : '#475569',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {isChecklistExpanded ? (
                                <>
                                    Contraer <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg> Expandir
                                </>
                            )}
                        </button>
                    </div>
                    {/* Envolvemos el Panel actual con position static para que fluya en este contenedor en vez del overlay */}
                    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                        <div style={{ transform: 'none', position: 'static', width: '100%', height: '100%', boxShadow: 'none' }}>
                            {/* Cargamos el panel pasándole una flag para estilo estático si toca, o lo ajustamos */}
                            {PanelDerecho ? PanelDerecho : (
                                <RevisionPedagogicaPanel salida={salida} onCerrar={onVolver} isStatic={true} isExpanded={isChecklistExpanded} />
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal de Lectura de Parada */}
            {paradaVer && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '800px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ecfeff', color: '#0891b2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Información Principal</h2>
                                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Configuración establecida por el profesor</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Fila 1 */}
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>NOMBRE DE LA PARADA</span>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', color: '#334155', fontSize: '14px', marginTop: '6px' }}>
                                    {paradaVer.nombre || 'Sin nombre'}
                                </div>
                            </div>

                            {/* Fila 2 */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>MOTIVO DE PARADA</span>
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', color: '#334155', fontSize: '14px', marginTop: '6px', textTransform: 'capitalize' }}>
                                        {paradaVer.motivo ? (paradaVer.motivo === 'retorno' ? 'Parada de Retorno' : paradaVer.motivo) : 'No especificado'}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>DURACIÓN ESTIMADA</span>
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', color: '#334155', fontSize: '15px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500' }}>{paradaVer.tiempo_estimado || paradaVer.tiempoEstimado || '--'}</span>
                                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>MIN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Fila 3 */}
                            <div>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>PARADA ESPECÍFICA / DIRECCIÓN</span>
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', color: '#334155', fontSize: '15px', marginTop: '6px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <div style={{ color: '#ef4444', flexShrink: 0, width: '18px', height: '18px' }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145c.182-.1.422-.25.69-.44a13.684 13.684 0 001.986-1.725C14.866 14.89 16.5 12.29 16.5 9a6.5 6.5 0 10-13 0c0 3.29 1.634 5.89 3.209 7.612a13.684 13.684 0 001.986 1.725 8.007 8.007 0 00.69.44c.12.066.216.11.281.145l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <span>{paradaVer.actividad || paradaVer.actividad || 'Sin detallar'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloque 2: Programacion */}
                        <div style={{ marginTop: '30px', borderTop: '2px dashed #e2e8f0', paddingTop: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Programación del Itinerario</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>FECHA ESPECÍFICA</span>
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '8px', color: '#334155', fontSize: '15px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500' }}>{paradaVer.fechaProgramada || paradaVer.fecha_programada || 'dd/mm/aaaa'}</span>
                                        <div style={{ color: '#94a3b8', width: '20px', height: '20px' }}>
                                            <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>HORA (APROX)</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', color: '#0f172a', fontSize: '16px', fontWeight: '700', minWidth: '60px', textAlign: 'center', letterSpacing: '2px' }}>
                                            {(paradaVer.horaProgramada || paradaVer.hora_programada || '--:--').split(':')[0] || '--'}
                                        </div>
                                        <strong style={{ color: '#94a3b8', fontSize: '1.3rem' }}>:</strong>
                                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 18px', borderRadius: '8px', color: '#0f172a', fontSize: '16px', fontWeight: '700', minWidth: '60px', textAlign: 'center', letterSpacing: '2px' }}>
                                            {(paradaVer.horaProgramada || paradaVer.hora_programada || '--:--').split(':')[1] || '--'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {paradaVer.notasItinerario && (
                                <div style={{ marginTop: '20px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>NOTAS / RECORDATORIOS (ITINERARIO)</span>
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', color: '#334155', fontSize: '14px', marginTop: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {paradaVer.notasItinerario}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '35px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setParadaVer(null)} style={{ background: '#0f172a', color: '#fff', padding: '12px 28px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s' }}>
                                Cerrar Modal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VistaRevision;
