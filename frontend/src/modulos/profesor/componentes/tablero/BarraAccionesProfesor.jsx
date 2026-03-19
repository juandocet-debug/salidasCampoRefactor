import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BarraAccionesProfesor.css';

const BarraAccionesProfesor = () => {
    const navigate = useNavigate();

    return (
        <div className="tp-toolbar">
            <div className="tp-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Buscar salidas..." />
            </div>
            <button className="tp-btn-filtro">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filtros
            </button>
            <button className="tp-btn-nueva" onClick={() => navigate('/nueva-salida')}>
                + Nueva Solicitud
            </button>
        </div>
    );
};

export default BarraAccionesProfesor;
