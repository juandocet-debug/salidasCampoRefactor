// src/modulos/profesor/componentes/logistica/TarjetaHotel.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tarjeta individual de un hotel en el grid de sugerencias.
// ─────────────────────────────────────────────────────────────────────────────
export default function TarjetaHotel({ hotel, num, onSeleccionar }) {
    const h = hotel;

    return (
        <div className="mh-card">
            {h.foto && <img src={h.foto} alt={h.nombre} className="mh-card__img" />}
            <div className={`mh-card__top ${h.foto ? 'has-img' : ''}`}>
                <span className="mh-card__num">{num}</span>
                {h.precioAprox && (
                    <span className="mh-card__precio" style={{ color: '#059669' }}>
                        {h.precioAprox}
                    </span>
                )}
            </div>
            <h4 className="mh-card__nombre">{h.nombre}</h4>
            <p className="mh-card__dir">{h.direccion}</p>
            <div className="mh-card__meta">
                {h.rating > 0 && (
                    <span className="mh-card__rating">⭐ {h.rating.toFixed(1)}<small>({h.totalResenas})</small></span>
                )}
                <span className="mh-card__dist">📏 {h.distRuta.toFixed(1)}km</span>
            </div>
            <button className="mh-card__btn" onClick={() => onSeleccionar(h)}>Seleccionar</button>
        </div>
    );
}
