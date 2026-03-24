import React, { useState } from 'react';
import './TablaHistorico.css';

// SVG Icons basic
const IcoList = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
);

const IcoChevron = ({ abierto }) => (
    <svg
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const TablaHistorico = () => {
    const [expandidoId, setExpandidoId] = useState(null);

    // Ejemplo de datos para histórico con datos generales simulados para el acordeón
    const datos = [
        {
            id: 1,
            titulo: 'Visita Parque Natural Puracé',
            subtitulo: 'Inscritos: 40 - Profesor: A. López',
            estado: 'Finalizada',
            color: 'finalizada',
            fecha: 'hace 2 meses',
            detalles: { asignaturas: 'Geología de Conservación', ubicacion: 'Popayán, Cauca', duracion: '3 días', observaciones: 'Salida exitosa sin novedades.' }
        },
        {
            id: 2,
            titulo: 'Simposio Geología Andes',
            subtitulo: 'Ponencia estudiantil en Bogotá',
            estado: 'Aprobada',
            color: 'aprobada',
            fecha: 'hace 1 mes',
            detalles: { asignaturas: 'Seminario de Investigación', ubicacion: 'Corferias, Bogotá', duracion: '2 días', observaciones: 'Pendiente confirmar hotel.' }
        },
        {
            id: 3,
            titulo: 'Recorrido Vía La Línea',
            subtitulo: 'Análisis geotécnico vial',
            estado: 'Evaluación',
            color: 'proceso',
            fecha: 'hace 3 semanas',
            detalles: { asignaturas: 'Geotecnia Vial', ubicacion: 'Cajamarca, Tolima', duracion: '1 día', observaciones: 'En revisión de viabilidad por derrumbes.' }
        },
        {
            id: 4,
            titulo: 'Expedición Botánica Río Magdalena',
            subtitulo: 'Recolección de especímenes',
            estado: 'Finalizada',
            color: 'finalizada',
            fecha: 'hace 1 año',
            detalles: { asignaturas: 'Biología Descriptiva', ubicacion: 'Honda, Tolima', duracion: '4 días', observaciones: 'Se recolectaron 200 muestras vegetales.' }
        },
        {
            id: 5,
            titulo: 'Taller Estructuras Metálicas',
            subtitulo: 'Visita a planta Acerías Paz del Río',
            estado: 'Finalizada',
            color: 'finalizada',
            fecha: 'hace 1 año',
            detalles: { asignaturas: 'Materiales Terrestres', ubicacion: 'Belencito, Boyacá', duracion: '2 días', observaciones: 'Todo en orden según el itinerario.' }
        }
    ];

    const toggleFila = (id) => {
        setExpandidoId(expandidoId === id ? null : id);
    };

    return (
        <div className="tabla-historico">
            <div className="th-header">
                <span className="th-titulo">Histórico de Salidas</span>
                <span className="th-ver-todos">Ver Todo</span>
            </div>
            <div className="th-lista">
                {datos.map((item) => {
                    const esAbierto = expandidoId === item.id;
                    return (
                        <div className={`th-item-container ${esAbierto ? 'th-item-container--abierto' : ''}`} key={item.id}>
                            <div className="th-item" onClick={() => toggleFila(item.id)}>
                                <div className="th-item__icono">
                                    <IcoList />
                                </div>
                                <div className="th-item__info">
                                    <h4 className="th-item__titulo">{item.titulo}</h4>
                                    <span className="th-item__sub">{item.subtitulo}</span>
                                </div>
                                <div className="th-item__meta">
                                    <span className="th-item__fecha">{item.fecha}</span>
                                    <span className={`th-item__badge th-item__badge--${item.color}`}>
                                        {item.estado}
                                    </span>
                                    <button className="th-btn-acordeon">
                                        <IcoChevron abierto={esAbierto} />
                                    </button>
                                </div>
                            </div>

                            {/* Panel Acordeón con animación mediante CSS max-height */}
                            <div className={`th-acordeon ${esAbierto ? 'th-acordeon--abierto' : ''}`}>
                                <div className="th-acordeon__contenido">
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Asignatura(s):</span>
                                        <span className="ac-valor">{item.detalles.asignaturas}</span>
                                    </div>
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Ubicación:</span>
                                        <span className="ac-valor">{item.detalles.ubicacion}</span>
                                    </div>
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Duración:</span>
                                        <span className="ac-valor">{item.detalles.duracion}</span>
                                    </div>
                                    <div className="th-acordeon__col">
                                        <span className="ac-label">Observaciones:</span>
                                        <span className="ac-valor">{item.detalles.observaciones}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TablaHistorico;
