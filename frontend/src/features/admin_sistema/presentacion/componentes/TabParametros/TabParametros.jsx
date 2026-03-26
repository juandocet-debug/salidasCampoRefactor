// modulos/admin/componentes/TabParametros.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tab de parámetros del sistema — Costos generales, rendimiento por vehículo
// y buscador IA. Sub-componentes: CardRendimiento, CardIA.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { clienteHttp } from '@/shared/api/clienteHttp';
import ModalParametrosCrud from './ModalParametrosCrud';

const API = '/api/admin/parametros/configuracion/';


// ── Sub-componente: campo numérico reutilizable ───────────────────────────────
function CampoNumerico({ label, campo, params, setParams }) {
    return (
        <div className="herr-campo">
            <label>{label}</label>
            <input
                type="number"
                value={params[campo] || ''}
                onChange={e => setParams({ ...params, [campo]: parseFloat(e.target.value) || 0 })}
                placeholder={`Ingrese ${label.toLowerCase()}`}
            />
        </div>
    );
}

// Solo parámetros globales (Costos Generales)

// ── Componente principal ──────────────────────────────────────────────────────
export default function TabParametros({ token, onToast }) {
    const [params,    setParams]   = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);

    const cargarParametros = () => {
        if (!token) return;
        clienteHttp.get(API)
            .then(r => { if (r.data.ok) setParams(r.data.datos); })
            .catch(() => onToast('❌ Error al cargar parámetros'));
    };

    useEffect(() => {
        cargarParametros();
    }, [token]);

    const guardar = async () => {
        setGuardando(true);
        try {
            const res = await clienteHttp.put(API, params);
            const data = res.data;
            setGuardando(false);
            if (data.ok) {
                setParams(data.datos);
                const n   = data.salidas_actualizadas || 0;
                const msg = n > 0
                    ? `✅ Parámetros actualizados — ${n} salida${n > 1 ? 's' : ''} recalculada${n > 1 ? 's' : ''}`
                    : '✅ Parámetros actualizados';
                onToast(msg);
            }
        } catch (e) {
            setGuardando(false);
            onToast('❌ Error al guardar');
        }
    };

    if (!params) return <div className="herr-vacio">Cargando parámetros…</div>;

    return (
        <>
            {/* Card 1: Costos Generales */}
            <div className="herr-card">

                <div className="herr-card-header--premium">
                    <div className="herr-premium-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div className="herr-premium-title-group" style={{ flex: 1 }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Costos Generales
                            <span className="herr-badge herr-badge--activo" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', transform: 'translateY(-1px)', marginLeft: '4px' }}>ACTIVO</span>
                            
                            {/* Botón Tuerquita - Integrado al Título */}
                            <button 
                                onClick={() => setModalAbierto(true)}
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'transparent', color: '#94a3b8', border: '1px solid transparent', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s', marginLeft: '2px', padding: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.transform = 'rotate(15deg) scale(1.1)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; e.currentTarget.style.borderColor = 'transparent'; }}
                                title="Configuración Avanzada de Parámetros"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </button>
                        </h3>
                        <p>Combustible, viáticos y horas extra del conductor</p>
                    </div>
                </div>
                <div className="herr-grid">
                    <CampoNumerico label="Precio del galón (COP)"       campo="precio_galon"      params={params} setParams={setParams} />
                    <CampoNumerico label="Viático conductor/día (COP)"   campo="costo_noche"       params={params} setParams={setParams} />
                    <CampoNumerico label="Hora extra 5pm-6pm (COP)"      campo="costo_hora_extra"  params={params} setParams={setParams} />
                    <CampoNumerico label="Hora extra 6pm-8pm (COP)"      campo="costo_hora_extra_2" params={params} setParams={setParams} />
                    <CampoNumerico label="Máx. horas viaje/día"          campo="max_horas_viaje"   params={params} setParams={setParams} />
                    <CampoNumerico label="Horas buffer (imprevistos)"    campo="horas_buffer"      params={params} setParams={setParams} />
                </div>
                
                <div style={{ marginTop: '24px' }}>
                    <button 
                        className="flota-btn-save" 
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px 20px', fontSize: '0.95rem' }} 
                        onClick={guardar} 
                        disabled={guardando}
                    >
                        {guardando ? (
                            'Guardando...'
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                Guardar Costos
                            </>
                        )}
                    </button>
                </div>
            </div>

            <ModalParametrosCrud 
                isOpen={modalAbierto} 
                onClose={() => { setModalAbierto(false); cargarParametros(); }} 
                token={token} 
                onToast={onToast} 
            />
        </>
    );
}
