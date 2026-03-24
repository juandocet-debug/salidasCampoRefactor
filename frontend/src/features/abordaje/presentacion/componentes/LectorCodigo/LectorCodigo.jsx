// src/funcionalidades/abordaje/componentes/LectorCodigo/LectorCodigo.jsx
// ──────────────────────────────────────────────────────────────────────────
// COMPONENTE para el Conductor: ingresa el código de 6 chars del estudiante.
// Usa tokens del design system existente (variables.css).
// ──────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import './LectorCodigo.css';

/**
 * LectorCodigo
 * @param {function} onConfirmar   - Recibe (codigo: string) cuando el conductor pulsa Verificar
 * @param {boolean}  cargando      - Muestra spinner mientras espera respuesta del backend
 * @param {object}   resultado     - Si fue exitoso, muestra la tarjeta verde
 * @param {string}   error         - Mensaje de error (código inválido / expirado)
 * @param {function} onLimpiar     - Resetea el estado para verificar otro estudiante
 */
export function LectorCodigo({ onConfirmar, cargando, resultado, error, onLimpiar }) {
    const [codigo, setCodigo] = useState('');
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (codigo.trim().length < 6) return;
        onConfirmar(codigo.trim().toUpperCase());
    };

    const handleLimpiar = () => {
        setCodigo('');
        onLimpiar?.();
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    // ── Si hay resultado exitoso, mostramos la tarjeta de confirmación ────
    if (resultado?.abordado) {
        return (
            <div className="lector-resultado lector-resultado--ok">
                <div className="lector-resultado__ico">✅</div>
                <div className="lector-resultado__titulo">¡Abordaje Confirmado!</div>
                <div className="lector-resultado__sub">
                    Verificado el {new Date(resultado.verificado_en).toLocaleTimeString('es-CO')}
                </div>
                <button className="lector-btn-siguiente" onClick={handleLimpiar}>
                    Verificar otro →
                </button>
            </div>
        );
    }

    return (
        <form className="lector-form" onSubmit={handleSubmit}>
            <div className="lector-form__titulo">Ingresar código del estudiante</div>

            {/* Input de 6 caracteres */}
            <input
                ref={inputRef}
                className={`lector-input ${error ? 'lector-input--error' : ''}`}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="A1B2C3"
                maxLength={6}
                autoFocus
                autoComplete="off"
                disabled={cargando}
            />

            {/* Mensaje de error */}
            {error && <div className="lector-error">{error}</div>}

            {/* Botones */}
            <div className="lector-acciones">
                {error && (
                    <button type="button" className="lector-btn-limpiar" onClick={handleLimpiar}>
                        Limpiar
                    </button>
                )}
                <button
                    type="submit"
                    className="lector-btn-verificar"
                    disabled={cargando || codigo.length < 6}
                >
                    {cargando ? 'Verificando...' : 'Verificar Código'}
                </button>
            </div>
        </form>
    );
}
