// src/modulos/profesor/componentes/logistica/ResumenRuta.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Panel compacto de resumen de ruta — mini-cards con imágenes de assets.
// ─────────────────────────────────────────────────────────────────────────────
import { fmtTiempo } from '@/features/salidas/dominio/reglas';
import imgBrujula from '@/assets/portadas/brujula.png';
import imgMochila from '@/assets/portadas/mochila.png';
import imgKayak from '@/assets/portadas/kayak.png';
import imgBinoculares from '@/assets/portadas/binoculares.png';
import './ResumenRuta.css';

export default function ResumenRuta({ rutaInfo, tiempos, maxHoras, onBuscarHotel }) {
    const cargando = rutaInfo.distancia_km <= 0;
    const pendiente = rutaInfo._pendienteGemini;
    const errorGemini = rutaInfo._geminiError;
    const tieneGemini = rutaInfo._gemini;

    if (cargando) {
        return (
            <div className="rr">
                <div className="rr__cards">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`rr__mini rr__mini--${['blue', 'amber', 'pink', 'dark'][i - 1]}`}>
                            <div className="rr__mini-skeleton" />
                            <div className="rr__mini-skeleton rr__mini-skeleton--sm" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const pct = Math.min(100, (tiempos.totalHoras / maxHoras) * 100);
    const barColor = tiempos.excede ? '#ef4444' : pct > 75 ? '#f59e0b' : '#22c55e';

    // Texto de tiempo para Volante y Total
    const tiempoVolante = pendiente && !tieneGemini ? '⏳ Calculando...'
        : errorGemini ? '⚠️ No disponible'
        : fmtTiempo(rutaInfo?.duracion_min || tiempos.minConduccion);

    // Total: si hay tiempos de paradas/conducción disponibles, mostrarlos aunque la IA esté pendiente
    const tiempoTotal = errorGemini ? '⚠️ N/D'
        : (rutaInfo?.duracion_min || tiempos.totalMin) > 0
            ? fmtTiempo(rutaInfo?.duracion_min || tiempos.totalMin)
            : '⏳ ...';

    return (
        <div className="rr">
            <div className="rr__cards">
                <div className="rr__mini rr__mini--blue">
                    <img src={imgBrujula} alt="" className="rr__mini-img" />
                    <span className="rr__mini-val">{rutaInfo.distancia_km}<small>km</small></span>
                    <span className="rr__mini-lbl">Ruta</span>
                    <div className="rr__mini-bar"><div style={{ width: '100%' }} /></div>
                </div>
                <div className="rr__mini rr__mini--amber">
                    <img src={imgMochila} alt="" className="rr__mini-img" />
                    <span className="rr__mini-val" style={{ fontSize: pendiente || errorGemini ? '0.7rem' : undefined }}>
                        {tiempoVolante}
                    </span>
                    <span className="rr__mini-lbl">
                        Volante {tieneGemini && <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>IA✓</span>}
                    </span>
                    <div className="rr__mini-bar"><div style={{ width: pendiente || errorGemini ? '0%' : `${Math.min(100, (tiempos.minConduccion / (maxHoras * 60)) * 100)}%` }} /></div>
                </div>
                {tiempos.minParadas > 0 && (
                    <div className="rr__mini rr__mini--pink">
                        <img src={imgKayak} alt="" className="rr__mini-img" />
                        <span className="rr__mini-val">+{fmtTiempo(tiempos.minParadas)}</span>
                        <span className="rr__mini-lbl">Paradas</span>
                        <div className="rr__mini-bar"><div style={{ width: `${Math.min(100, (tiempos.minParadas / (maxHoras * 60)) * 100)}%` }} /></div>
                    </div>
                )}
                <div className="rr__mini rr__mini--dark">
                    <img src={imgBinoculares} alt="" className="rr__mini-img" />
                    <span className="rr__mini-val" style={{ fontSize: pendiente || errorGemini ? '0.7rem' : undefined }}>
                        {tiempoTotal}
                    </span>
                    <span className="rr__mini-lbl">Total</span>
                    <div className="rr__mini-bar" style={{ background: 'rgba(255,255,255,0.15)' }}>
                        <div style={{ width: pendiente || errorGemini ? '0%' : `${pct}%`, background: barColor }} />
                    </div>
                </div>
            </div>

            {tiempos.excede && !tiempos.tieneHospedaje && (
                <div className="rr__alert rr__alert--warn">
                    <div className="rr__alert-dot" />
                    <p><strong>Hospedaje requerido</strong> — Viaje excede {maxHoras}h</p>
                    <button type="button" className="rr__alert-btn" onClick={onBuscarHotel}>
                        Buscar Hotel
                    </button>
                </div>
            )}

            {tiempos.excede && tiempos.tieneHospedaje && (
                <div className="rr__alert rr__alert--ok">
                    <div className="rr__alert-dot" />
                    <p><strong>Hospedaje OK</strong> — Regla de {maxHoras}h cumplida</p>
                </div>
            )}
        </div>
    );
}
