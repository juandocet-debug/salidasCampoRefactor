// modulos/admin/componentes/TabParametros.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tab de parámetros del sistema — Costos generales, rendimiento por vehículo
// y buscador IA. Sub-componentes: CardRendimiento, CardIA.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../nucleo/api/config';

const API = `${API_URL}/api/admin/parametros/`;


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

    useEffect(() => {
        if (!token) return;
        fetch(API, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => { if (d.ok) setParams(d.datos); })
            .catch(() => onToast('❌ Error al cargar parámetros'));
    }, [token]);

    const guardar = async () => {
        setGuardando(true);
        const res  = await fetch(API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(params),
        });
        const data = await res.json();
        setGuardando(false);
        if (data.ok) {
            setParams(data.datos);
            const n   = data.salidas_actualizadas || 0;
            const msg = n > 0
                ? `✅ Parámetros actualizados — ${n} salida${n > 1 ? 's' : ''} recalculada${n > 1 ? 's' : ''}`
                : '✅ Parámetros actualizados';
            onToast(msg);
        } else {
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
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            Costos Generales
                            <span className="herr-badge herr-badge--activo" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', transform: 'translateY(-1px)' }}>ACTIVO</span>
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

        </>
    );
}
