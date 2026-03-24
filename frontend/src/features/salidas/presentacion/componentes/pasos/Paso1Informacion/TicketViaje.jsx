import React from 'react';
import { DIAS, MESES } from './constantes';

function formatFechaHora(fecha) {
    if (!fecha) return { dia: '--', fecha: '-- ---' };
    const d = new Date(fecha + 'T00:00:00');
    return { dia: DIAS[d.getDay()], fecha: `${d.getDate()} ${MESES[d.getMonth()]}` };
}

export default function TicketViaje({ form }) {
    const salida  = formatFechaHora(form.fecha_inicio);
    const llegada = formatFechaHora(form.fecha_fin);
    return (
        <div className="nsal-viaje-ticket">
            <div className="nsal-ticket-col">
                <div className="nsal-ticket-label-top">✈️ SALIDA</div>
                <div className="nsal-ticket-big-hora">{form.hora_inicio || '--:--'}</div>
                <div className="nsal-ticket-fecha">
                    <span className="nsal-ticket-dia">{salida.dia}</span>
                    <span className="nsal-ticket-date">{salida.fecha}</span>
                </div>
            </div>
            <div className="nsal-ticket-sep">
                <div className="nsal-ticket-line" />
                <div className="nsal-ticket-avion">→</div>
                <div className="nsal-ticket-line" />
            </div>
            <div className="nsal-ticket-col nsal-ticket-col--llegada">
                <div className="nsal-ticket-label-top">🏁 LLEGADA EST.</div>
                <div className="nsal-ticket-big-hora nsal-ticket-big-hora--llegada">
                    {form.hora_fin || '--:--'}
                </div>
                <div className="nsal-ticket-fecha">
                    <span className="nsal-ticket-dia">{llegada.dia}</span>
                    <span className="nsal-ticket-date">{llegada.fecha}</span>
                </div>
                <div className="nsal-ticket-sublabel">
                    {form.hora_fin ? '📍 Calculada por el sistema' : 'Traza la ruta en Paso 3'}
                </div>
            </div>
        </div>
    );
}
