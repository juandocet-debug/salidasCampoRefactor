import React from 'react';

export default function StepperNuevaSalida({ ETAPAS, pasoActivo, setPasoActivo, onVolver }) {
    return (
        <>
            <div className="nsal-stepper-container">
                {/* Botón volver a la izquierda */}
                {onVolver && (
                    <button type="button" className="nsal-btn-volver" onClick={onVolver}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                )}
                <div className="nsal-stepper">
                    {ETAPAS.map((etapa, idx) => {
                        const completado = pasoActivo > etapa.id;
                        const activo = pasoActivo === etapa.id;
                        return (
                            <React.Fragment key={etapa.id}>
                                <div className={`nsal-step ${activo ? 'nsal-step--activo' : ''} ${completado ? 'nsal-step--completado' : ''}`} onClick={() => pasoActivo > etapa.id && setPasoActivo(etapa.id)}>
                                    <div className="nsal-step__circulo">
                                        {completado ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : etapa.id}
                                    </div>
                                    <div className="nsal-step__textos">
                                        <span className="nsal-step__titulo">{etapa.label}</span>
                                    </div>
                                </div>
                                {idx < ETAPAS.length - 1 && (
                                    <div className={`nsal-step__linea ${completado ? 'nsal-step__linea--llena' : ''}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="nsal-encabezado-paso">
                <span className="nsal-badge">PASO {pasoActivo} DE {ETAPAS.length}</span>
                <h2>{ETAPAS[pasoActivo - 1].label} {pasoActivo === 1 ? 'Básica' : pasoActivo === 2 ? 'Académica' : ''}</h2>
                <p>{ETAPAS[pasoActivo - 1].desc}</p>
            </div>
        </>
    );
}
