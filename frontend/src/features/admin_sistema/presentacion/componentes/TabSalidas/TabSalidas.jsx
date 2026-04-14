import React, { useEffect, useState } from 'react';
import ModalConfirmar from '@/shared/componentes/generales/ModalConfirmar/ModalConfirmar';
import useAlertas from '@/shared/estado/useAlertas';

const API_URL = 'http://localhost:8000/api/admin/salidas/';

const ESTADO_STYLE = {
    borrador:    { background: '#f1f5f9', color: '#64748b' },
    enviada:     { background: '#dbeafe', color: '#1d4ed8' },
    en_revision: { background: '#fef9c3', color: '#a16207' },
    aprobada:    { background: '#dcfce7', color: '#15803d' },
    favorable:   { background: '#d1fae5', color: '#065f46' },
    rechazada:   { background: '#fee2e2', color: '#b91c1c' },
};

export default function TabSalidas({ token }) {
    const [salidas, setSalidas]   = useState([]);
    const [cargando, setCargando] = useState(true);
    const [confirmId, setConfirmId] = useState(null);
    const [eliminando, setEliminando] = useState(false);
    const agregarAlerta = useAlertas(s => s.agregarAlerta);

    const cargar = async () => {
        setCargando(true);
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            const json = await res.json();
            setSalidas(Array.isArray(json) ? json : []);
        } catch {
            agregarAlerta('Error al conectar con el servidor', 'error');
            setSalidas([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const eliminar = async () => {
        setEliminando(true);
        try {
            const res = await fetch(`${API_URL}${confirmId}/`, {
                method: 'DELETE',
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            if (res.status === 204 || res.ok) {
                agregarAlerta('Salida eliminada correctamente', 'exito');
                setSalidas(prev => prev.filter(s => s.id !== confirmId));
            } else {
                agregarAlerta('Error al eliminar la salida', 'error');
            }
        } catch {
            agregarAlerta('Error de conexión al eliminar', 'error');
        } finally {
            setEliminando(false);
            setConfirmId(null);
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: '#94a3b8' }}>
                    {salidas.length} salida{salidas.length !== 1 ? 's' : ''} en el sistema
                </span>
                <button className="herr-btn herr-btn--ghost herr-btn--sm" onClick={cargar}>
                    ↻ Recargar
                </button>
            </div>

            {/* Tabla */}
            <div className="herr-tabla-wrapper">
                {cargando ? (
                    <div className="herr-vacio">Cargando salidas...</div>
                ) : salidas.length === 0 ? (
                    <div className="herr-vacio">No hay salidas en la base de datos.</div>
                ) : (
                    <table className="herr-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre / Asignatura</th>
                                <th>Estado</th>
                                <th>Semestre</th>
                                <th>Fecha Inicio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salidas.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: 4, fontSize: 12 }}>
                                            {s.codigo}
                                        </code>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{s.nombre}</div>
                                        {s.asignatura && <div style={{ fontSize: 12, color: '#94a3b8' }}>{s.asignatura}</div>}
                                    </td>
                                    <td>
                                        <span className="herr-badge" style={ESTADO_STYLE[s.estado] || { background: '#f1f5f9', color: '#64748b' }}>
                                            {s.estado?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{s.semestre || '—'}</td>
                                    <td>{s.fecha_inicio || '—'}</td>
                                    <td>
                                        <div className="herr-acciones">
                                            <button
                                                className="herr-action-circle herr-action-circle--delete"
                                                title="Eliminar salida"
                                                onClick={() => setConfirmId(s.id)}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal del sistema */}
            {confirmId && (
                <ModalConfirmar
                    titulo="¿Eliminar esta salida?"
                    descripcion="Esta acción es irreversible. Se eliminará la salida y todos sus datos asociados del sistema."
                    labelConfirmar="Sí, eliminar"
                    labelCargando="Eliminando..."
                    cargando={eliminando}
                    onConfirmar={eliminar}
                    onCancelar={() => setConfirmId(null)}
                />
            )}
        </div>
    );
}
