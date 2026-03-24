import React from 'react';

export default function Paso2Planeacion({ form, setForm }) {
    return (
        <div className="nsal-grid-2col fade-in">
            <fieldset className="nsal-fieldset">
                <legend>Objetivos</legend>
                <label>
                    <span>Objetivo General *</span>
                    <textarea rows="3" value={form.objetivo_general}
                        onChange={e => setForm({ ...form, objetivo_general: e.target.value })}
                        placeholder="Use un verbo en infinitivo..." />
                </label>
                <label>
                    <span>Objetivos Específicos *</span>
                    <textarea rows="5" value={form.objetivos_especificos}
                        onChange={e => setForm({ ...form, objetivos_especificos: e.target.value })}
                        placeholder="Liste los objetivos (mínimo 2)..." />
                </label>
            </fieldset>
            <fieldset className="nsal-fieldset">
                <legend>Planeación Académica</legend>
                <label>
                    <span>Estrategia Metodológica *</span>
                    <textarea rows="5" value={form.estrategia_metodologica}
                        onChange={e => setForm({ ...form, estrategia_metodologica: e.target.value })}
                        placeholder="Describa el enfoque pedagógico..." />
                </label>
                <label>
                    <span>Productos Académicos Esperados</span>
                    <textarea rows="5" value={form.productos_esperados}
                        onChange={e => setForm({ ...form, productos_esperados: e.target.value })}
                        placeholder="Lista los productos (Informes, muestras, herbarios, etc.)..." />
                </label>
            </fieldset>
        </div>
    );
}
