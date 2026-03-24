import React from 'react';
import { CardMatcha, CardKPI } from '@/shared/componentes/generales/Tarjetas/Tarjetas';
import { BotonAccion, EtiquetaPill, ItemUsuario } from '@/shared/componentes/generales/ElementosUX/ElementosUX';

// Estilos de los módulos para que el Sandbox pueda renderizarlos correctamente
import '@/features/salidas/presentacion/componentes/ListaTarjetasProfesor/ListaTarjetasProfesor.css';
import '@/features/salidas/presentacion/componentes/BarraAccionesProfesor/BarraAccionesProfesor.css';
import '@/features/salidas/presentacion/paginas/NuevaSalida/nsal-ticket.css';
import '@/features/salidas/presentacion/componentes/pasos/Paso3Logistica/p3l-cards.css'; // Donde suele estar nsal-kcard
import '@/features/salidas/presentacion/componentes/pasos/KanbanItinerario/KanbanItinerario.css';

export default function TabComponentes() {
    return (
        <>
            <div className="herr-card">
                <div className="herr-card-header--premium">
                    <div className="herr-premium-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="herr-premium-title-group" style={{ flex: 1 }}>
                        <h3>Librería de Componentes & Cards</h3>
                        <p>Catálogo interactivo de componentes visuales (Sandbox). Utiliza este listado como referencia para ensamblar nuevas vistas u hojas usando la nomemclatura estandarizada.</p>
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: CARDS ICEMATCHA ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>CardMatcha ("Bento Box")</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Utiliza este contenedor para mostrar entidades complejas (vehículos, usuarios) con imágenes centrales, un bloque de color en la parte superior y pill tags en la base, usando el componente <strong>&lt;CardMatcha /&gt;</strong>.</p>
                </div>
                
                <div className="herr-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    <CardMatcha 
                        title="Vehículo Institucional"
                        color="blue"
                        badgeText="DISPONIBLE"
                        badgeColor="#16a34a"
                        bannerText="INSTITUCIONAL — UPN"
                        imageSrc="https://cdn3d.iconscout.com/3d/premium/thumb/bus-4993648-4159573.png"
                        tags={['Bus', '40 PAX', '8 km/gal', '⛽ Diésel']}
                        actions={
                            <>
                                <button className="ui-card-btn ui-card-btn--edit" title="Editar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Editar
                                </button>
                                <button className="ui-card-btn ui-card-btn--danger" title="Eliminar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                            </>
                        }
                    />

                    <CardMatcha 
                        title="Tercerizado"
                        color="green"
                        badgeText="EN MANTENIMIENTO"
                        badgeColor="#dc2626"
                        bannerText="FLOTA EXTERNA"
                        imageSrc="https://cdn3d.iconscout.com/3d/premium/thumb/tour-bus-5174351-4325492.png"
                        tags={['Buseta', '20 PAX', '🔋 Gas Natural']}
                        actions={
                            <button className="ui-card-btn ui-card-btn--edit" title="Editar">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Editar
                            </button>
                        }
                    />

                    <CardMatcha 
                        title="Vehículo Administrativo"
                        color="orange"
                        badgeText="EN VIAJE"
                        badgeColor="#0284c7"
                        bannerText="ADMINISTRATIVO"
                        imageSrc="https://cdn3d.iconscout.com/3d/premium/thumb/van-5174352-4325493.png"
                        tags={['Camioneta', '8 PAX', '12 km/gal', '⛽ Gasolina']}
                    />
                </div>
            </div>

            {/* ── SECCIÓN: CARDS KPI ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>CardKPI (Modulares de Tablero)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Bloque minimalista para representar una métrica única (Total de Salidas, Alumnos, etc). Utiliza este contenedor llamando al componente <strong>&lt;CardKPI /&gt;</strong>.</p>
                </div>
                
                <div className="herr-grid">
                    <CardKPI 
                        label="Usuarios Activos"
                        value="1,492"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                        iconBg="#f5f3ff"
                        iconColor="#5c4dfa"
                    />
                    <CardKPI 
                        label="Presupuesto"
                        value="$840K"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
                        iconBg="#f0fdf4"
                        iconColor="#16a34a"
                    />
                    <CardKPI 
                        label="Alertas del Sistema"
                        value="12"
                        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>}
                        iconBg="#fef2f2"
                        iconColor="#ef4444"
                    />
                </div>
            </div>

            {/* ── SECCIÓN: MODULO PROFESOR - TARJETAS DE SALIDA ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>Tarjeta Principal de Tablero (.card-new)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Utilizada en el dashboard del profesor para listar las salidas de campo. Incluye su propio layout de grid, imagen lateral e indicador de progreso (stepper).</p>
                </div>
                
                <div style={{ maxWidth: '400px' }}>
                    <div className="card-new card-new--dark" style={{ background: '#e85d04', position: 'relative', overflow: 'hidden' }}>
                        <div className="card-new__bg-icon" style={{ opacity: 1, width: '220px', height: '220px', right: '-25px', top: 'auto', bottom: '-40px', transform: 'rotate(-5deg)', zIndex: 0 }}>
                            <img src="https://i.ibb.co/L5hY5M0p/mochila.png" alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        </div>
                        
                        <div className="card-new__content" style={{ zIndex: 1 }}>
                            <div className="card-new__header">
                                <h3 className="card-new__title">Ruta Geológica Andina</h3>
                                <p className="card-new__subtitle">Geología General</p>
                            </div>

                            <div className="card-new__actions-top">
                                <button className="c-btn-action top-btn c-btn-action--editar">
                                    <span className="action-circle">✎</span>
                                </button>
                                <button className="c-btn-action top-btn c-btn-action--borrar">
                                    <span className="action-circle _del">✕</span>
                                </button>
                            </div>

                            <div className="card-ticket">
                                <div className="card-ticket__col">
                                    <span className="card-ticket__label">✈️ SALIDA</span>
                                    <span className="card-ticket__fecha-main">Vie 13 Mar</span>
                                    <span className="card-ticket__hora-sub">08:12</span>
                                </div>
                                <div className="card-ticket__sep">→</div>
                                <div className="card-ticket__col card-ticket__col--llegada">
                                    <span className="card-ticket__label">🏁 LLEGADA</span>
                                    <span className="card-ticket__fecha-main">Dom 15 Mar</span>
                                    <span className="card-ticket__hora-sub card-ticket__hora-sub--llegada">15:20</span>
                                </div>
                            </div>
                            
                            <div className="card-new__footer">
                                <div className="card-new__stepper-wrapper">
                                    {/* Mock stepper */}
                                    <div className="c-stepper-full">
                                        <div className="c-step-item"><div className="c-step-indicator"><div className="c-stepper-circle active past" /><div className="c-stepper-line line-past" /></div><span className="c-step-label label-active text-start">BORR.</span></div>
                                        <div className="c-step-item"><div className="c-step-indicator"><div className="c-stepper-circle" /><div className="c-stepper-line" /></div><span className="c-step-label text-center">COORD.</span></div>
                                        <div className="c-step-item"><div className="c-step-indicator"><div className="c-stepper-circle" /></div><span className="c-step-label text-end">CONS.</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: WIDGETS DE LOGÍSTICA (MAPA/ITINERARIO) ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>Widgets Logísticos (.nsal-ticket / .nsal-kcard)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Bloques utilizados durante el armado del itinerario. El ticket grande de ruta e información y la tarjeta slate miniatura tipo Kanban.</p>
                </div>

                <div className="herr-grid" style={{ alignItems: 'flex-start' }}>
                    {/* Tarjeta Azul de LLegada (Paso 1) */}
                    <div>
                        <div className="nsal-viaje-ticket" style={{ maxWidth: '100%', marginBottom: '1rem' }}>
                            <div className="nsal-ticket-col">
                                <div className="nsal-ticket-label-top">✈️ SALIDA</div>
                                <div className="nsal-ticket-big-hora">08:12:00</div>
                                <div className="nsal-ticket-fecha">
                                    <span className="nsal-ticket-dia">VIE</span>
                                    <span className="nsal-ticket-date">13 Mar</span>
                                </div>
                            </div>
                            <div className="nsal-ticket-sep">
                                <div className="nsal-ticket-line" />
                                <div className="nsal-ticket-avion">→</div>
                                <div className="nsal-ticket-line" />
                            </div>
                            <div className="nsal-ticket-col nsal-ticket-col--llegada">
                                <div className="nsal-ticket-label-top">🏁 LLEGADA EST.</div>
                                <div className="nsal-ticket-big-hora nsal-ticket-big-hora--llegada">
                                    15:20:00
                                </div>
                                <div className="nsal-ticket-fecha">
                                    <span className="nsal-ticket-dia">DOM</span>
                                    <span className="nsal-ticket-date">15 Mar</span>
                                </div>
                                <div className="nsal-ticket-sublabel">📍 Calculada por el sistema</div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta tipo Tablero Kanban para Parada */}
                    <div>
                        <div className="nsal-kcard nsal-kcard--food" style={{ minWidth: '220px', maxWidth: '300px' }}>
                            <div className="nsal-kcard__main">
                                <div className="nsal-kcard__illust-wrap">
                                    <img src="https://i.ibb.co/NgB0jYxL/pngtree-eco-friendly-adventurestips-for-a-green-vacation-png-image-15617281.png" alt="Punto" className="nsal-kcard__illust" />
                                </div>
                                <div className="nsal-kcard__text">
                                    <h4 className="nsal-kcard__title">Madrid</h4>
                                    <span className="nsal-kcard__subtitle">ALMUERZO</span>
                                </div>
                                <div className="nsal-kcard__acts">
                                    <button type="button" className="nsal-kcard__btn-mini">✎</button>
                                    <button type="button" className="nsal-kcard__btn-mini _del">✕</button>
                                </div>
                            </div>
                            
                            <div className="nsal-kcard__footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '8px' }}>
                                 <span className="nsal-kcard__time" style={{ color: '#fff', fontSize: '0.85em' }}>
                                     ⏱ 2:04 pm • 50 min
                                 </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: BOTONES GLOBALES DE TABLERO ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>Botones de Acción (Tablero y Herramientas)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Botones rápidos para integrar en Headers de tarjetas o acciones directas, utilizando las clases estándares.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                    
                    {/* Botones del Toolbar del Profesor */}
                    <button className="tp-btn-filtro">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        Filtros
                    </button>
                    <button className="tp-btn-nueva">
                        + Nueva Solicitud
                    </button>

                    <div style={{ width: '1px', height: '30px', background: '#ccc', margin: '0 1rem' }} />

                    <button className="ui-card-btn">Botón Simple (ui-card-btn)</button>
                    <button className="ui-card-btn ui-card-btn--edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> 
                        Editar Objeto
                    </button>
                    <button className="ui-card-btn ui-card-btn--danger">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        Eliminar Peligroso
                    </button>
                </div>
            </div>

            {/* ── SECCIÓN: TARJETAS DE NAVEGACIÓN (HERRAMIENTAS) ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>Tarjeta Navegación Lateral (.herr-new-card)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Utilizada en el menú izquierdo de configuraciones. Muestra ícono, título, estadística y barra de progreso. Soporta variantes de color (.herr-new-card--calendario, etc).</p>
                </div>
                
                <div style={{ maxWidth: '300px' }}>
                    <div className="herr-new-card herr-new-card--calendario active" style={{ cursor: 'default' }}>
                        <div className="herr-new-top">
                            <div className="herr-new-top-left">
                                <div className="herr-new-icon-box">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"/></svg>
                                </div>
                                <div className="herr-new-texts">
                                    <h3>Calendario</h3>
                                    <p>Ventanas Operativas</p>
                                </div>
                            </div>
                            <div className="herr-new-stats">
                                <div className="herr-new-stat-num">08</div>
                                <div className="herr-new-stat-lbl">Periodos</div>
                            </div>
                        </div>
                        
                        <div className="herr-new-bottom">
                            <div className="herr-new-progress">
                                <div className="fill" style={{ width: '60%' }}></div>
                            </div>
                            <div className="herr-new-action">
                                Agendar <span className="arrow">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECCIÓN: ELEMENTOS UX (PILLS, AVATARES, BOTONES REDONDOS) ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>Elementos Micro-UI / UX (.ux-pill, .ux-user-item)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Componentes reutilizables a nivel molecular ubicados en <code>nucleo/componentes/generales/ElementosUX/</code>.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    
                    {/* Botones Redondos Suaves */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Botones de Acción (BotonAccion)</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <BotonAccion tipo="editar" titulo="Editar" />
                            <BotonAccion tipo="borrar" titulo="Borrar / Eliminar" />
                            <BotonAccion tipo="ver" titulo="Ver Info" />
                        </div>
                    </div>

                    {/* Etiquetas Pill */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Etiquetas / Pills (EtiquetaPill)</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            <EtiquetaPill texto="Bus" color="default" />
                            <EtiquetaPill texto="40 PAX" color="default" />
                            <EtiquetaPill texto="8 km/gal" color="default" />
                            <EtiquetaPill icono="⛽" texto="Diésel" color="default" />
                            <EtiquetaPill icono="🔋" texto="Híbrido" color="green" />
                            <EtiquetaPill texto="Crítico" color="red" />
                        </div>
                    </div>

                    {/* Usuarios */}
                    <div>
                        <h4 style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Listado de Usuarios (ItemUsuario)</h4>
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                            <ItemUsuario 
                                nombre="Maren Maureen" 
                                subtexto="202014589" 
                                avatarUrl="https://i.pravatar.cc/150?img=32" 
                                estado_color="#0284c7" 
                            />
                            <ItemUsuario 
                                nombre="Ryan Herwinds" 
                                subtexto="201948572" 
                                avatarUrl="https://i.pravatar.cc/150?img=11" 
                                estado_color="#cbd5e1" 
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* ── SECCIÓN: FORMAS Y FECHAS (CALENDARIO) ── */}
            <div className="herr-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>Selector de Rangos de Fecha (.rdp)</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>El calendario base para selección de rangos (Date Picker). Utiliza <code>react-day-picker</code> inyectado con nuestras variables CSS en los archivos principales.</p>
                </div>

                <div style={{ background: '#fff', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '350px', border: '1px solid #e1e7eb' }}>
                    {/* Mock simple de react-day-picker */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: '800', color: '#1e3a8a' }}>
                        <span>Nov 2026</span>
                        <span style={{ color: '#94a3b8' }}>&lt;   &gt;</span>
                    </div>
                    <div className="herr-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.8rem' }}>
                        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d,i) => (
                            <span key={i} style={{ color: '#94a3b8', fontWeight: '700', marginBottom: '0.5rem' }}>{d}</span>
                        ))}
                        {[...Array(8).keys()].map(i => <span key={`empty-${i}`}></span>)}
                        {/* Rango de selección: 9 al 13 */}
                        <span style={{ padding: '8px', background: '#3b82f6', color: '#fff', borderRadius: '20px', fontWeight: 'bold' }}>9</span>
                        <span style={{ padding: '8px', background: '#e0f2fe', color: '#0f172a' }}>10</span>
                        <span style={{ padding: '8px', background: '#e0f2fe', color: '#0f172a' }}>11</span>
                        <span style={{ padding: '8px', background: '#e0f2fe', color: '#0f172a' }}>12</span>
                        <span style={{ padding: '8px', background: '#3b82f6', color: '#fff', borderRadius: '20px', fontWeight: 'bold' }}>13</span>
                        
                        {/* Resto de dias mock */}
                        {['14','15','16','17','18','19','20','21','22','23'].map(d => (
                            <span key={d} style={{ padding: '8px', color: '#475569' }}>{d}</span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
