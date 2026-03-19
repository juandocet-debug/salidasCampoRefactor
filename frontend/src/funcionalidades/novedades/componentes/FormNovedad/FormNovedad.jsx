// src/funcionalidades/novedades/componentes/FormNovedad/FormNovedad.jsx
// ─────────────────────────────────────────────────────────────────── <140L

import React, { useState } from 'react';
import './FormNovedad.css';

const TIPOS = [
    { valor: 'mecanica',  label: '🔧 Mecánica'   },
    { valor: 'accidente', label: '⚠️  Accidente'  },
    { valor: 'clima',     label: '🌧️  Clima'       },
    { valor: 'vial',      label: '🚧 Vial'         },
    { valor: 'salud',     label: '🏥 Salud'        },
    { valor: 'otro',      label: '📌 Otro'         },
];
const URGENCIAS = [
    { valor: 'baja',    label: 'Baja',    color: '#4ade80' },
    { valor: 'media',   label: 'Media',   color: '#fbbf24' },
    { valor: 'alta',    label: 'Alta',    color: '#fb923c' },
    { valor: 'critica', label: 'Crítica', color: '#f87171' },
];

export function FormNovedad({ onRegistrar, cargando }) {
    const [tipo,       setTipo]       = useState('mecanica');
    const [urgencia,   setUrgencia]   = useState('media');
    const [descripcion,setDescripcion]= useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!descripcion.trim()) return;
        onRegistrar({ tipo, urgencia, descripcion });
        setDescripcion('');
    };

    return (
        <form className="form-nov" onSubmit={handleSubmit}>
            <div className="form-nov__titulo">Reportar Novedad</div>

            {/* Tipo */}
            <div className="form-nov__grupo">
                <label className="form-nov__label">Tipo</label>
                <div className="form-nov__chips">
                    {TIPOS.map(t => (
                        <button
                            key={t.valor} type="button"
                            className={`form-nov__chip ${tipo === t.valor ? 'activo' : ''}`}
                            onClick={() => setTipo(t.valor)}
                        >{t.label}</button>
                    ))}
                </div>
            </div>

            {/* Urgencia */}
            <div className="form-nov__grupo">
                <label className="form-nov__label">Urgencia</label>
                <div className="form-nov__chips">
                    {URGENCIAS.map(u => (
                        <button
                            key={u.valor} type="button"
                            style={urgencia === u.valor ? { borderColor: u.color, color: u.color } : {}}
                            className={`form-nov__chip ${urgencia === u.valor ? 'activo' : ''}`}
                            onClick={() => setUrgencia(u.valor)}
                        >{u.label}</button>
                    ))}
                </div>
            </div>

            {/* Descripción */}
            <div className="form-nov__grupo">
                <label className="form-nov__label">Descripción</label>
                <textarea
                    className="form-nov__textarea"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    rows={3}
                    placeholder="Describe lo que ocurrió..."
                    required
                />
            </div>

            <button type="submit" className="form-nov__btn" disabled={cargando || !descripcion.trim()}>
                {cargando ? 'Registrando...' : 'Registrar Novedad'}
            </button>
        </form>
    );
}
