import React from 'react';

export const WidgetPresupuesto = ({ planificado, disponible, consumido }) => {
    const pct = ((consumido / planificado) * 100).toFixed(0);

    return (
        <div style={{
            gridColumn: 'span 2',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Presupuesto 2026
                </span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: '#0f172a' }}>
                    ${(planificado / 1000000).toFixed(1)}M
                </span>
            </div>
            
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', margin: '4px 0 16px 0', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', borderRadius: '4px', transition: 'width 1s ease' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                    Comprometido: <strong style={{ color: '#0f172a' }}>${(consumido / 1000000).toFixed(1)}M</strong> ({pct}%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
                    Disponible: <strong style={{ color: '#0f172a' }}>${(disponible / 1000000).toFixed(1)}M</strong>
                </span>
            </div>
        </div>
    );
};
