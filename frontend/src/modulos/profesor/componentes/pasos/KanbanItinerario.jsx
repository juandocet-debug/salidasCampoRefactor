// src/modulos/profesor/componentes/pasos/KanbanItinerario.jsx
// ──────────────────────────────────────────────────────────────────────────────
// Tablero Kanban de paradas, agrupadas por día. Soporta Drag & Drop y tab
// IDA / RETORNO. Extraído de Paso3Logistica para respetar SRP.
// ──────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from 'react';
import ChipParada from '../logistica/ChipParada';
import { IconoTabIda, IconoTabRetorno, IconoMapaVacio } from '../logistica/LogisticaIconos';
import './KanbanItinerario.css';

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function agruparPorDia(paradas, dStart) {
    const grupos = {};
    paradas.forEach((p, i) => {
        let diaNombre = 'Sin Asignar', diaFecha = '', sortKey = '9999-99-99';
        if (p.fechaProgramada) {
            sortKey = p.fechaProgramada;
            const pDate = new Date(p.fechaProgramada + 'T00:00:00');
            if (dStart) {
                const diffDias = Math.floor((pDate - dStart) / 86400000) + 1;
                diaNombre = `Día ${diffDias}`;
                diaFecha  = `${pDate.getDate()} ${MESES_CORTOS[pDate.getMonth()]}`;
            } else {
                diaNombre = `${pDate.getDate()} ${MESES_CORTOS[pDate.getMonth()]}`;
            }
        }
        if (!grupos[sortKey]) grupos[sortKey] = { diaNombre, diaFecha, items: [] };
        grupos[sortKey].items.push({ ...p, originalIndex: i + 1 });
    });
    return grupos;
}

export default function KanbanItinerario({
    tabActivo,
    onCambiarTab,
    puntosRuta,
    puntosRetorno,
    fechaInicio,
    onEditarParada,
    onNuevaParada,
    onQuitarParada,
    onQuitarParadaRetorno,
    onMoverParada,
    onMoverParadaRetorno,
}) {
    const dStart = fechaInicio ? new Date(fechaInicio + 'T00:00:00') : null;

    const gruposIda     = useMemo(() => agruparPorDia(puntosRuta.slice(1, -1),     dStart), [puntosRuta,     fechaInicio]);
    const gruposRetorno = useMemo(() => agruparPorDia(puntosRetorno.slice(1, -1),   dStart), [puntosRetorno,  fechaInicio]);
    const grupos        = tabActivo === 'retorno' ? gruposRetorno : gruposIda;
    const llavesOrdenadas = Object.keys(grupos).sort();

    // ── Drag & Drop ──────────────────────────────────────────────────────────
    const handleDragOver  = (e) => { e.preventDefault(); e.currentTarget.classList.add('nsal-kanban-col--dragover'); };
    const handleDragLeave = (e) => { e.preventDefault(); e.currentTarget.classList.remove('nsal-kanban-col--dragover'); };
    const handleDrop      = (e, targetDateKey) => {
        e.preventDefault();
        e.currentTarget.classList.remove('nsal-kanban-col--dragover');
        const sourceIndex = e.dataTransfer.getData('sourceIndex');
        if (!sourceIndex) return;
        if (tabActivo === 'retorno') onMoverParadaRetorno(parseInt(sourceIndex, 10), targetDateKey);
        else                          onMoverParada(parseInt(sourceIndex, 10), targetDateKey);
    };
    const boardRef = React.useRef(null);
    React.useEffect(() => {
        const board = boardRef.current;
        if (!board) return;
        const onWheelHorizontal = (e) => {
            if (e.deltaY !== 0) { 
                board.scrollLeft += e.deltaY; 
                e.preventDefault(); 
            }
        };
        // Adjuntar con passive: false para evitar el error de React en eventos pasivos
        board.addEventListener('wheel', onWheelHorizontal, { passive: false });
        // Limpiador
        return () => board.removeEventListener('wheel', onWheelHorizontal);
    }, [llavesOrdenadas.length]);

    return (
        <div className="nsal-kanban-section fade-in">
            {/* Tabs header */}
            <div className="p3l-tabs-header">
                <div className="p3l-tabs">
                    <button
                        className={`p3l-tab ${tabActivo === 'ida' ? 'p3l-tab--activo' : ''}`}
                        onClick={() => onCambiarTab('ida')}
                    >
                        <IconoTabIda />
                        Itinerario de Ida
                        <span className="p3l-tab-count">{puntosRuta.slice(1, -1).length}</span>
                    </button>
                    <button
                        className={`p3l-tab ${tabActivo === 'retorno' ? 'p3l-tab--activo' : ''}`}
                        onClick={() => onCambiarTab('retorno')}
                    >
                        <IconoTabRetorno />
                        Itinerario de Retorno
                        <span className="p3l-tab-count">{puntosRetorno.slice(1, -1).length}</span>
                    </button>
                </div>
                <button
                    type="button"
                    className="nsal-btn-agregar-parada"
                    style={{ margin: 0, width: 'auto', padding: '10px 24px' }}
                    onClick={onNuevaParada}
                >
                    + Agregar{tabActivo === 'retorno' ? ' al Retorno' : ' a la Ruta'}
                </button>
            </div>

            {/* Board o empty state */}
            {llavesOrdenadas.length === 0 ? (
                <div className="p3l-kanban-empty">
                    <IconoMapaVacio />
                    <p>No hay paradas {tabActivo === 'retorno' ? 'de retorno' : 'de ida'} registradas.</p>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Usa el botón &quot;Agregar&quot; para planificar el itinerario.
                    </p>
                </div>
            ) : (
                <div className="nsal-kanban-board" ref={boardRef}>
                    {llavesOrdenadas.map(key => (
                        <div
                            key={key}
                            className="nsal-kanban-col"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, key)}
                        >
                            <div className="nsal-kanban-col-head">
                                <div className="nsal-kanban-col-title-group">
                                    <span className="nsal-kanban-col-dia">{grupos[key].diaNombre}</span>
                                    {grupos[key].diaFecha && (
                                        <span className="nsal-kanban-col-fecha">{grupos[key].diaFecha}</span>
                                    )}
                                </div>
                                <span className="nsal-kanban-col-count">{grupos[key].items.length}</span>
                            </div>
                            <div className="nsal-kanban-col-body">
                                {grupos[key].items.map(p => (
                                    <ChipParada
                                        key={p.originalIndex}
                                        punto={p}
                                        indice={p.originalIndex}
                                        onEditar={onEditarParada}
                                        onQuitar={tabActivo === 'retorno' ? onQuitarParadaRetorno : onQuitarParada}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
