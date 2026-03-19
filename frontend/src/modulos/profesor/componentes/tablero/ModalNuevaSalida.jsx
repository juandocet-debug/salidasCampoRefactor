import React, { useState } from 'react';
import axios from 'axios';
import useAutenticacion from '../../../autenticacion/estado/useAutenticacion';
import { API_URL } from '../../../../nucleo/api/config';
import './ModalNuevaSalida.css';

const ICONOS = [
    { id: 'IcoPC', label: 'Computador' },
    { id: 'IcoScience', label: 'Ciencia' },
    { id: 'IcoMap', label: 'Mapa' }
];

const COLORES = [
    { hex: '#4A8DAC', label: 'Cian OTIUM' },
    { hex: '#345B8D', label: 'Azul Profundo' },
    { hex: '#16a34a', label: 'Verde Botánico' },
    { hex: '#b45309', label: 'Tierra / Geología' },
    { hex: '#6366f1', label: 'Índigo Digital' }
];

const ModalNuevaSalida = ({ isOpen, onClose, onCreada }) => {
    const { token } = useAutenticacion();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        nombre: '',
        asignatura: '',
        semestre: '2026-1',
        programa: '',
        num_estudiantes: 0,
        justificacion: '',
        icono: 'IcoMap',
        color: '#4A8DAC'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            await axios.post(`${API_URL}/api/profesor/salidas/`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onCreada();
            onClose();
            // Limpiar
            setForm({
                nombre: '', asignatura: '', semestre: '2026-1', programa: '',
                num_estudiantes: 0, justificacion: '', icono: 'IcoMap', color: '#4A8DAC'
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la salida');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="mns-overlay">
            <div className="mns-modal">
                <div className="mns-header">
                    <h2>Nueva Solicitud de Salida</h2>
                    <button className="mns-btn-cerrar" onClick={onClose}>×</button>
                </div>

                <form className="mns-form" onSubmit={handleSubmit}>
                    <div className="mns-seccion">
                        <label>Nombre de la práctica / salida</label>
                        <input type="text" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Reconocimiento Geológico" />
                    </div>

                    <div className="mns-row">
                        <div className="mns-seccion">
                            <label>Asignatura</label>
                            <input type="text" required value={form.asignatura} onChange={e => setForm({ ...form, asignatura: e.target.value })} />
                        </div>
                        <div className="mns-seccion">
                            <label>Programa</label>
                            <input type="text" required value={form.programa} onChange={e => setForm({ ...form, programa: e.target.value })} />
                        </div>
                    </div>

                    <div className="mns-row">
                        <div className="mns-seccion">
                            <label>N° Estudiantes</label>
                            <input type="number" required min="1" value={form.num_estudiantes} onChange={e => setForm({ ...form, num_estudiantes: e.target.value })} />
                        </div>
                        <div className="mns-seccion">
                            <label>Semestre</label>
                            <input type="text" required value={form.semestre} onChange={e => setForm({ ...form, semestre: e.target.value })} />
                        </div>
                    </div>

                    <div className="mns-seccion">
                        <label>Justificación inicial</label>
                        <textarea rows="3" value={form.justificacion} onChange={e => setForm({ ...form, justificacion: e.target.value })}></textarea>
                    </div>

                    {/* Selector de InterfazVisual */}
                    <div className="mns-design-panel">
                        <h4>Diseño de Tarjeta (UI)</h4>

                        <div className="mns-design-row">
                            <div className="mns-selector">
                                <label>Ícono de Representación</label>
                                <div className="mns-opciones">
                                    {ICONOS.map(ico => (
                                        <button
                                            key={ico.id}
                                            type="button"
                                            className={`mns-opcion ${form.icono === ico.id ? 'mns-opcion--activa' : ''}`}
                                            onClick={() => setForm({ ...form, icono: ico.id })}
                                        >
                                            {ico.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mns-selector">
                                <label>Color de Tarjeta</label>
                                <div className="mns-opciones-color">
                                    {COLORES.map(c => (
                                        <button
                                            key={c.hex}
                                            type="button"
                                            className={`mns-color-btn ${form.color === c.hex ? 'mns-color-btn--activa' : ''}`}
                                            style={{ background: c.hex }}
                                            title={c.label}
                                            onClick={() => setForm({ ...form, color: c.hex })}
                                        >
                                            {form.color === c.hex && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <div className="mns-error">{error}</div>}

                    <div className="mns-footer">
                        <button type="button" className="mns-btn-cancelar" onClick={onClose} disabled={cargando}>Cancelar</button>
                        <button type="submit" className="mns-btn-guardar" disabled={cargando}>
                            {cargando ? 'Guardando...' : 'Crear Salida'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalNuevaSalida;
