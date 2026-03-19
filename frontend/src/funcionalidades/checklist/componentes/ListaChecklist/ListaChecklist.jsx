// src/funcionalidades/checklist/componentes/ListaChecklist/ListaChecklist.jsx
// ───────────────────────────────────────────────────────────────────── <140L

import React from 'react';
import './ListaChecklist.css';

const ESTADO_CONFIG = {
    ok:       { icono: '✅', clase: 'ok',      label: 'OK'      },
    no_ok:    { icono: '❌', clase: 'no-ok',   label: 'No OK'   },
    na:       { icono: '➖', clase: 'na',       label: 'N/A'     },
    pendiente:{ icono: '⏳', clase: 'pendiente',label: 'Pendiente'},
};

const CATEGORIA_ICONO = {
    mecanica:   '🔧',
    seguridad:  '🛡️',
    documentos: '📋',
    confort:    '🪑',
};

function ItemChecklist({ item, onMarcar, marcando }) {
    const cfg = ESTADO_CONFIG[item.estado] ?? ESTADO_CONFIG.pendiente;
    const esMarcando = marcando === item.id;

    return (
        <div className={`cl-item cl-item--${cfg.clase} ${esMarcando ? 'cl-item--cargando' : ''}`}>
            <span className="cl-item__ico">{cfg.icono}</span>

            <span className="cl-item__texto">{item.item}</span>

            <div className="cl-item__acciones">
                {['ok', 'no_ok', 'na'].map(est => (
                    <button
                        key={est}
                        className={`cl-btn cl-btn--${est.replace('_','-')} ${item.estado === est ? 'activo' : ''}`}
                        onClick={() => onMarcar(item.id, est)}
                        disabled={esMarcando}
                        title={ESTADO_CONFIG[est].label}
                    >
                        {ESTADO_CONFIG[est].icono}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function ListaChecklist({ items = [], onMarcar, marcando, progreso }) {
    const porCategoria = items.reduce((acc, item) => {
        const cat = item.categoria ?? 'otro';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
        <div className="cl-contenedor">
            {/* Barra de progreso */}
            <div className="cl-progreso">
                <div className="cl-progreso__barra">
                    <div className="cl-progreso__fill" style={{ width: `${progreso?.porcentaje ?? 0}%` }} />
                </div>
                <span className="cl-progreso__lbl">
                    {progreso?.completados ?? 0} / {progreso?.total ?? 0} ítems completados
                </span>
            </div>

            {/* Ítems por categoría */}
            {Object.entries(porCategoria).map(([cat, catItems]) => (
                <div key={cat} className="cl-categoria">
                    <div className="cl-categoria__titulo">
                        {CATEGORIA_ICONO[cat] ?? '📌'} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </div>
                    {catItems.map(item => (
                        <ItemChecklist key={item.id} item={item} onMarcar={onMarcar} marcando={marcando} />
                    ))}
                </div>
            ))}
        </div>
    );
}
