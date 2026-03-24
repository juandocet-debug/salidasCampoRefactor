import React from 'react';
import { PORTADAS, COLORES } from './constantes';

export default function PanelDiseno({ form, setForm }) {
    return (
        <fieldset className="nsal-fieldset nsal-design-panel">
            <legend>Personalización Visual (UI)</legend>
            <div className="nsal-row-2">
                <div className="nsal-col">
                    <span className="nsal-label-inner">Imagen de Portada</span>
                    <div className="nsal-icon-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        {PORTADAS.map(img => (
                            <div
                                key={img.id}
                                className={`nsal-icon-btn ${form.icono === img.id ? 'active' : ''}`}
                                onClick={() => setForm({ ...form, icono: img.id })}
                                title={img.label}
                                style={{
                                    padding: 0, height: '60px', overflow: 'hidden',
                                    border: form.icono === img.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                }}
                            >
                                <img
                                    src={img.url}
                                    alt={img.label}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        Object.assign(e.target.parentElement.style, {
                                            background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', color: '#64748b', fontWeight: '600',
                                            textAlign: 'center', padding: '4px',
                                        });
                                        e.target.parentElement.innerText = img.label;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="nsal-col">
                    <span className="nsal-label-inner">Color de Tarjeta</span>
                    <div className="nsal-color-grid">
                        {COLORES.map(c => (
                            <div
                                key={c.hex}
                                className={`nsal-color-btn ${form.color === c.hex ? 'active' : ''}`}
                                style={{ background: c.hex }}
                                onClick={() => setForm({ ...form, color: c.hex })}
                                title={c.label}
                            >
                                {form.color === c.hex && '✓'}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </fieldset>
    );
}
