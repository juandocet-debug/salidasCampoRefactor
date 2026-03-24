import React from 'react';
import './PaginaConstruccion.css';

export default function PaginaConstruccion() {
    return (
        <div className="pagina-construccion-container fade-in">
            <div className="pagina-construccion-content">
                <div className="icono-construccion">🚧</div>
                <h1 className="titulo-construccion">Página en Construcción</h1>
                <p className="texto-construccion">
                    Este módulo está en fase de desarrollo activo.
                    Próximamente estará disponible con todas sus funcionalidades.
                </p>
            </div>
        </div>
    );
}
