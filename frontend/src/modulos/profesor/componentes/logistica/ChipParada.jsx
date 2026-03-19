// src/modulos/profesor/componentes/logistica/ChipParada.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Tarjeta Kanban para una parada (reemplaza al viejo ChipParada expandido)
// ─────────────────────────────────────────────────────────────────────────────

const IcoRelojSvg = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>
);

function formatearHora(horaStr) {
    if (!horaStr) return '';
    const [h, m] = horaStr.split(':');
    const hora = parseInt(h, 10);
    const h12 = hora % 12 || 12;
    return `${h12}:${m} ${hora >= 12 ? 'pm' : 'am'}`;
}

export default function ChipParada({ punto, indice, onEditar, onQuitar }) {
    const esHospedaje = punto.motivo === 'hospedaje' || punto.motivo === 'descanso_nocturno';
    const esAlmuerzo = punto.motivo === 'almuerzo';
    const esRefrigerio = punto.motivo === 'refrigerio';

    let colorClass = 'nsal-kcard--base';
    let imgSrc = 'https://i.ibb.co/NgB0jYxL/pngtree-eco-friendly-adventurestips-for-a-green-vacation-png-image-15617281.png';

    if (esHospedaje) {
        colorClass = 'nsal-kcard--hotel';
        imgSrc = 'https://i.ibb.co/7tBcjjMW/pngtree-personal-assistant-planning-an-ecofriendly-vacation-png-image-12695420.png';
    } else if (esAlmuerzo) {
        colorClass = 'nsal-kcard--food';
        imgSrc = 'https://i.ibb.co/NgB0jYxL/pngtree-eco-friendly-adventurestips-for-a-green-vacation-png-image-15617281.png';
    } else if (esRefrigerio) {
        colorClass = 'nsal-kcard--snack';
        imgSrc = 'https://i.ibb.co/gZC3m3sV/sustainable-tourism-ecotourism-eco-friendly-recreation-vector-removebg-preview.png';
    }

    // Overrides de personalización visual (si el usuario escogió manualmente)
    if (punto.icono) {
        imgSrc = punto.icono;
    }
    const customStyle = {};
    if (punto.color) {
        customStyle.background = punto.color;
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData('sourceIndex', indice);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => e.target.classList.add('nsal-kcard--dragging'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('nsal-kcard--dragging');
    };

    return (
        <div 
            className={`nsal-kcard ${colorClass}`}
            style={customStyle}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="nsal-kcard__main">
                <div className="nsal-kcard__illust-wrap">
                    <img src={imgSrc} alt="Punto" className="nsal-kcard__illust" />
                </div>
                <div className="nsal-kcard__text">
                    <h4 className="nsal-kcard__title">{punto.nombreParada || punto.nombre}</h4>
                    {punto.motivo && <span className="nsal-kcard__subtitle">{punto.motivo.replace('_', ' ')}</span>}
                </div>
                <div className="nsal-kcard__acts">
                    <button type="button" onClick={() => onEditar(indice)} title="Editar" className="nsal-kcard__btn-mini">✎</button>
                    <button type="button" onClick={() => onQuitar(indice)} title="Quitar" className="nsal-kcard__btn-mini _del">✕</button>
                </div>
            </div>
            
            <div className="nsal-kcard__footer">
                 <span className="nsal-kcard__time">
                     <IcoRelojSvg /> 
                     {formatearHora(punto.horaProgramada) || 'Hora por definir'}
                     {punto.tiempoEstimado && ` • ${punto.tiempoEstimado}`}
                 </span>
            </div>
            
            {punto.notasItinerario && (
                <div className="nsal-kcard__notes">{punto.notasItinerario}</div>
            )}
        </div>
    );
}
