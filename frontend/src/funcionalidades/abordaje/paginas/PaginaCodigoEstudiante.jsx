// src/funcionalidades/abordaje/paginas/PaginaCodigoEstudiante.jsx
// ──────────────────────────────────────────────────────────────────────────
// PÁGINA: Estudiante ve su código de verificación para el día de la salida
// < 120 líneas
// ──────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { activarCodigo } from '../api/abordajeApi';
import './PaginaCodigoEstudiante.css';

export default function PaginaCodigoEstudiante() {
    const { salidaId } = useParams();

    const [estado, setEstado]       = useState('inicial');  // inicial | cargando | activo | error
    const [codigo, setCodigo]       = useState('');
    const [expira, setExpira]       = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const handleActivar = async () => {
        setEstado('cargando');
        try {
            // En producción la foto vendría de una subida previa.
            // Por ahora enviamos vacío — el backend lo validará.
            const data = await activarCodigo(Number(salidaId), '');
            setCodigo(data.codigo);
            setExpira(new Date(data.expira_en).toLocaleTimeString('es-CO'));
            setEstado('activo');
        } catch (e) {
            setMensajeError(e?.response?.data?.error || 'No se pudo generar el código.');
            setEstado('error');
        }
    };

    return (
        <div className="cod-est-layout">

            {/* Inicial: botón para generar */}
            {estado === 'inicial' && (
                <div className="cod-est-card">
                    <div className="cod-est__ico">🎟️</div>
                    <div className="cod-est__titulo">Tu código de abordaje</div>
                    <p className="cod-est__desc">
                        El conductor necesita este código para confirmar tu embarque.
                        Actívalo el día de la salida.
                    </p>
                    <button className="cod-est__btn" onClick={handleActivar}>
                        Generar Código
                    </button>
                </div>
            )}

            {/* Cargando */}
            {estado === 'cargando' && (
                <div className="cod-est-card">
                    <div className="cod-est__spinner" />
                    <p className="cod-est__desc">Generando tu código...</p>
                </div>
            )}

            {/* Código activo */}
            {estado === 'activo' && (
                <div className="cod-est-card cod-est-card--activo">
                    <div className="cod-est__ico">✅</div>
                    <div className="cod-est__titulo">Tu código está listo</div>
                    <div className="cod-est__codigo">{codigo}</div>
                    <p className="cod-est__expira">Válido hasta las {expira}</p>
                    <p className="cod-est__desc">
                        Muestra este código al conductor cuando suba al vehículo.
                    </p>
                </div>
            )}

            {/* Error */}
            {estado === 'error' && (
                <div className="cod-est-card cod-est-card--error">
                    <div className="cod-est__ico">⚠️</div>
                    <div className="cod-est__titulo">No se pudo generar</div>
                    <p className="cod-est__desc">{mensajeError}</p>
                    <button className="cod-est__btn" onClick={() => setEstado('inicial')}>
                        Intentar de nuevo
                    </button>
                </div>
            )}
        </div>
    );
}
