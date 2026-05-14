import React, { useState } from 'react';
import './ModalTipoCambio.css';

const IconHorarios = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const IconRuta = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>
);

const IconParticipantes = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const IconCostos = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const IconObjetivos = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const IconOtro = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
);

const TIPOS = [
    { id: 'horarios',      label: 'Cambio de horarios',      desc: 'Hora de salida, llegada o paradas',         icon: IconHorarios },
    { id: 'ruta',          label: 'Cambio de ruta',          desc: 'Destino, paradas o recorrido',              icon: IconRuta },
    { id: 'participantes', label: 'Cambio participantes',    desc: 'Número de estudiantes o docentes',          icon: IconParticipantes },
    { id: 'costos',        label: 'Cambio de costos',        desc: 'Presupuesto o costo estimado',              icon: IconCostos },
    { id: 'objetivos',     label: 'Cambio de objetivos',     desc: 'Objetivos o metodología académica',         icon: IconObjetivos },
    { id: 'otro',          label: 'Otro cambio',             desc: 'Cambio menor no clasificado',               icon: IconOtro },
];

export default function ModalTipoCambio({ onConfirmar, onCancelar }) {
    const [seleccionado, setSeleccionado] = useState(null);
    const [descripcionLibre, setDescripcionLibre] = useState('');

    const handleConfirmar = () => {
        if (!seleccionado) return;
        const tipo = TIPOS.find(t => t.id === seleccionado);
        const notaStr = tipo.label;
        const nota = seleccionado === 'otro' && descripcionLibre.trim()
            ? `Otro: ${descripcionLibre.trim()}`
            : notaStr;
        onConfirmar(nota);
    };

    return (
        <div className="mtc-overlay">
            <div className="mtc-modal">
                <div className="mtc-header">
                    <div className="mtc-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mtc-header-icon">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <div>
                        <h3 className="mtc-title">Justificación de la Modificación</h3>
                        <p className="mtc-subtitle">Selecciona la naturaleza principal del ajuste realizado en la salida. Esta información se registrará para la Coordinación Académica.</p>
                    </div>
                </div>

                <div className="mtc-opciones">
                    {TIPOS.map(tipo => {
                        const Icon = tipo.icon;
                        const isSelected = seleccionado === tipo.id;
                        return (
                            <button
                                key={tipo.id}
                                className={`mtc-opcion ${isSelected ? 'mtc-opcion--activo' : ''}`}
                                onClick={() => setSeleccionado(tipo.id)}
                            >
                                <div className="mtc-opcion-header">
                                    <Icon />
                                    <span className="mtc-opcion-label">{tipo.label}</span>
                                </div>
                                <span className="mtc-opcion-desc">{tipo.desc}</span>
                            </button>
                        );
                    })}
                </div>

                {seleccionado === 'otro' && (
                    <div className="mtc-libre fade-in">
                        <label className="mtc-label">Especifica el cambio:</label>
                        <input
                            type="text"
                            className="mtc-input"
                            placeholder="Ej. Cambio de empresa de transporte..."
                            maxLength={100}
                            value={descripcionLibre}
                            onChange={e => setDescripcionLibre(e.target.value)}
                            autoFocus
                        />
                    </div>
                )}

                <div className="mtc-footer">
                    <button className="mtc-btn-cancelar" onClick={onCancelar}>
                        Cancelar Edición
                    </button>
                    <button
                        className="mtc-btn-confirmar"
                        onClick={handleConfirmar}
                        disabled={!seleccionado || (seleccionado === 'otro' && !descripcionLibre.trim())}
                    >
                        Confirmar y Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
