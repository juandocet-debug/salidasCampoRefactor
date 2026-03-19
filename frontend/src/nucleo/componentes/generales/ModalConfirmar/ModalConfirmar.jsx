// src/nucleo/componentes/generales/ModalConfirmar/ModalConfirmar.jsx
// Componente ÚNICO de confirmación de borrado para todo el proyecto.
// Reemplaza: ModalConfirmarBorrar (tablero/ListaTarjetasProfesor) y ModalConfirmar (admin/TabAcademico)
import React from 'react';
import './ModalConfirmar.css';

const IcoBorrar = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
);

/**
 * ModalConfirmar — modal de confirmación de acción destructiva.
 * @param {string}   titulo      - Título del modal (ej: "¿Eliminar salida?")
 * @param {ReactNode} descripcion - Descripción (puede incluir <strong>)
 * @param {string}   labelConfirmar - Texto del botón de acción (default: "Sí, eliminar")
 * @param {boolean}  cargando    - Deshabilita botones y muestra texto de carga
 * @param {Function} onConfirmar - Callback al confirmar
 * @param {Function} onCancelar  - Callback al cancelar / cerrar
 */
export default function ModalConfirmar({
    titulo      = '¿Eliminar elemento?',
    descripcion,
    labelConfirmar = 'Sí, eliminar',
    labelCargando  = 'Eliminando...',
    cargando    = false,
    onConfirmar,
    onCancelar,
}) {
    return (
        <div className="otm-confirmar-overlay" onClick={onCancelar}>
            <div className="otm-confirmar" onClick={e => e.stopPropagation()}>
                <div className="otm-confirmar__icono">
                    <IcoBorrar />
                </div>
                <h3 className="otm-confirmar__titulo">{titulo}</h3>
                {descripcion && (
                    <p className="otm-confirmar__desc">{descripcion}</p>
                )}
                <div className="otm-confirmar__acciones">
                    <button
                        className="otm-confirmar__cancelar"
                        onClick={onCancelar}
                        disabled={cargando}
                    >
                        Cancelar
                    </button>
                    <button
                        className="otm-confirmar__borrar"
                        onClick={onConfirmar}
                        disabled={cargando}
                    >
                        {cargando ? labelCargando : labelConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}
