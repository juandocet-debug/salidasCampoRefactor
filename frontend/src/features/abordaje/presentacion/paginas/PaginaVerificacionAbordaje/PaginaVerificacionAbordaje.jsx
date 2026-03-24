// src/funcionalidades/abordaje/paginas/PaginaVerificacionAbordaje.jsx
// ──────────────────────────────────────────────────────────────────────────
// PÁGINA: Conductor verifica el abordaje de estudiantes
// < 160 líneas — patrón del proyecto respetado
// ──────────────────────────────────────────────────────────────────────────

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useConfirmarAbordaje, useListaAbordaje } from '@/features/abordaje/presentacion/hooks/useAbordaje';
import { LectorCodigo } from '@/features/abordaje/presentacion/componentes/LectorCodigo/LectorCodigo';
import './PaginaVerificacionAbordaje.css';

export default function PaginaVerificacionAbordaje() {
    const { salidaId } = useParams();
    const id = Number(salidaId);

    // ── Hooks del slice ──────────────────────────────────────────────────
    const { confirmar, cargando, error, resultado, limpiar } = useConfirmarAbordaje(id);
    const { stats, cargar: cargarStats } = useListaAbordaje(id);

    // Carga estadísticas al entrar y tras cada abordaje confirmado
    useEffect(() => { cargarStats(); }, [cargarStats]);
    useEffect(() => {
        if (resultado?.abordado) { cargarStats(); }
    }, [resultado, cargarStats]);

    return (
        <div className="verif-layout">

            {/* ── Panel izquierdo: Stats en tiempo real ──────────────── */}
            <aside className="verif-stats">
                <div className="verif-stats__titulo">Estado del Abordaje</div>
                {stats ? (
                    <>
                        <div className="verif-stat-bloque verif-stat-bloque--ok">
                            <span className="verif-stat__num">{stats.abordados}</span>
                            <span className="verif-stat__lbl">Abordaron</span>
                        </div>
                        <div className="verif-stat-bloque verif-stat-bloque--pend">
                            <span className="verif-stat__num">{stats.pendientes}</span>
                            <span className="verif-stat__lbl">Pendientes</span>
                        </div>

                        {/* Barra de progreso */}
                        <div className="verif-progreso">
                            <div className="verif-progreso__barra">
                                <div
                                    className="verif-progreso__fill"
                                    style={{ width: `${stats.porcentaje}%` }}
                                />
                            </div>
                            <span className="verif-progreso__pct">{stats.porcentaje}%</span>
                        </div>

                        <div className="verif-stat-total">
                            {stats.total} estudiantes en total
                        </div>
                    </>
                ) : (
                    <div className="verif-cargando">Cargando estadísticas...</div>
                )}
            </aside>

            {/* ── Panel derecho: Lector de código ───────────────────── */}
            <main className="verif-main">
                <LectorCodigo
                    onConfirmar={confirmar}
                    cargando={cargando}
                    resultado={resultado}
                    error={error}
                    onLimpiar={limpiar}
                />
            </main>
        </div>
    );
}
