import React from 'react';
import { CardKPI } from '@/shared/componentes/generales/Tarjetas/Tarjetas';
import './KpisProfesor.css';

const KpisProfesor = ({ salidas = [], cargando = false }) => {
    // Calculando KPIs reales (usando los estados de la base de datos)
    const countBorradores = salidas.filter(s => s.estado === 'borrador').length;
    const countAprobadas = salidas.filter(s => s.estado === 'aprobada').length;
    // Si están listas o ejecutándose (o ya enviándose)
    const countEnProceso = salidas.filter(s => ['enviada', 'en_revision', 'favorable'].includes(s.estado)).length;

    return (
        <div className="tp-kpis">
            <CardKPI 
                label="Borradores"
                value={cargando ? '-' : countBorradores}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
                iconBg="#f5f3ff"
                iconColor="#5c4dfa"
            />
            <CardKPI 
                label="Total Aprobadas"
                value={cargando ? '-' : countAprobadas}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
                iconBg="#f0fdf4"
                iconColor="#16a34a"
            />
            <CardKPI 
                label="En Proceso"
                value={cargando ? '-' : countEnProceso}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                iconBg="#f0f9ff"
                iconColor="#0284c7"
            />
        </div>
    );
};

export default KpisProfesor;
