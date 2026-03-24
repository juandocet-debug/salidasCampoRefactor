// modulos/admin/componentes/TabCalendario.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tab de ventanas de programación (fechas apertura/cierre).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '@/shared/api/config';

const API = `${API_URL}/api/admin/ventanas/`;

export default function TabCalendario({ token, onToast }) {
    const [ventanas, setVentanas] = useState([]);
    const [nueva, setNueva] = useState({ nombre: '', fecha_apertura: '', fecha_cierre: '' });
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const cargar = useCallback(async () => {
        const data = await fetch(API, { headers }).then(r => r.json());
        setVentanas(data.results || data);
    }, [token]);

    useEffect(() => { cargar(); }, [cargar]);

    const crear = async () => {
        if (!nueva.nombre || !nueva.fecha_apertura || !nueva.fecha_cierre) return;
        await fetch(API, { method: 'POST', headers, body: JSON.stringify(nueva) });
        setNueva({ nombre: '', fecha_apertura: '', fecha_cierre: '' });
        onToast('✅ Ventana de programación creada');
        cargar();
    };

    const eliminar = async (id) => {
        if (!window.confirm('¿Eliminar esta ventana?')) return;
        await fetch(`${API}${id}/`, { method: 'DELETE', headers });
        onToast('🗑️ Ventana eliminada');
        cargar();
    };

    const hoy = new Date().toISOString().split('T')[0];

    return (
        <div className="herr-card">
            <div className="herr-card-header--premium">
                <div className="herr-premium-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                </div>
                <div className="herr-premium-title-group">
                    <h3>Ventanas de Programación</h3>
                    <p>Define los períodos en que los profesores pueden crear salidas</p>
                </div>
            </div>
            <div className="herr-form-inline">
                <div className="herr-campo">
                    <label>Nombre</label>
                    <input
                        value={nueva.nombre}
                        onChange={e => setNueva({ ...nueva, nombre: e.target.value })}
                        placeholder="Ej: Primer semestre 2026"
                    />
                </div>
                <div className="herr-campo">
                    <label>Fecha apertura</label>
                    <input
                        type="date"
                        value={nueva.fecha_apertura}
                        onChange={e => setNueva({ ...nueva, fecha_apertura: e.target.value })}
                    />
                </div>
                <div className="herr-campo">
                    <label>Fecha cierre</label>
                    <input
                        type="date"
                        value={nueva.fecha_cierre}
                        onChange={e => setNueva({ ...nueva, fecha_cierre: e.target.value })}
                    />
                </div>
                <button className="herr-btn herr-btn--dark herr-btn--sm" onClick={crear}>+ Agregar</button>
            </div>
            <div className="herr-tabla-wrapper">
                <table className="herr-tabla">
                    <thead><tr><th>Nombre</th><th>Apertura</th><th>Cierre</th><th>Estado</th><th></th></tr></thead>
                    <tbody>
                        {ventanas.length === 0 && <tr><td colSpan={5} className="herr-vacio">No hay ventanas de programación</td></tr>}
                        {ventanas.map(v => {
                            const vigente = v.activa && v.fecha_apertura <= hoy && hoy <= v.fecha_cierre;
                            return (
                                <tr key={v.id}>
                                    <td><strong>{v.nombre}</strong></td>
                                    <td>{v.fecha_apertura}</td>
                                    <td>{v.fecha_cierre}</td>
                                    <td>
                                        <span className={`herr-badge ${vigente ? 'herr-badge--activo' : 'herr-badge--inactivo'}`}>
                                            {vigente ? '🟢 Vigente' : v.activa ? '⏳ Programada' : '⛔ Cerrada'}
                                        </span>
                                    </td>
                                    <td className="herr-acciones">
                                        <button className="herr-action-circle herr-action-circle--delete" onClick={() => eliminar(v.id)} title="Eliminar">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
