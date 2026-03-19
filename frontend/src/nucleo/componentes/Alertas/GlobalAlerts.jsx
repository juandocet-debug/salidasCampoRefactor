import React from 'react';
import useAlertas from '../../estado/useAlertas';
import './GlobalAlerts.css';

const GlobalAlerts = () => {
    const alertas = useAlertas((state) => state.alertas);
    const removerAlerta = useAlertas((state) => state.removerAlerta);

    if (alertas.length === 0) return null;

    return (
        <div className="otium-global-alerts">
            {alertas.map((alerta) => (
                <div key={alerta.id} className={`otium-alert otium-alert--${alerta.tipo}`}>
                    <div className="otium-alert__icon">
                        {alerta.tipo === 'exito' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                        {alerta.tipo === 'error' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        )}
                        {alerta.tipo === 'info' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        )}
                        {alerta.tipo === 'advertencia' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        )}
                    </div>
                    <div className="otium-alert__content">
                        {alerta.mensaje}
                    </div>
                    <button className="otium-alert__close" onClick={() => removerAlerta(alerta.id)}>
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default GlobalAlerts;
