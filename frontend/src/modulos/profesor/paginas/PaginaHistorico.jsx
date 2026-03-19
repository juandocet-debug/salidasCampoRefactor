import React from 'react';
import TablaHistorico from '../../../nucleo/componentes/generales/TablaHistorico/TablaHistorico';

const PaginaHistorico = () => {
    return (
        <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Contenedor fluido para ocupar todo el espacio disponible */}
            <div style={{ flex: 1, width: '100%' }}>
                <br />
                <TablaHistorico />
            </div>
        </div>
    );
};

export default PaginaHistorico;
