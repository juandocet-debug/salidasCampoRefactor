import React from 'react';

export default function Paso4Evaluacion({ form, setForm }) {
    return (
        <div className="nsal-grid-1col fade-in">
            <fieldset className="nsal-fieldset">
                <legend>Criterios de Evaluación</legend>
                <label>
                    <span>Criterios de Evaluación *</span>
                    <textarea rows="4" value={form.criterios_evaluacion} onChange={e => setForm({ ...form, criterios_evaluacion: e.target.value })} placeholder="Defina los criterios..."></textarea>
                </label>
                <label className="nsal-mt">
                    <span>Evidencias que evaluará (Mock)</span>
                    <div className="nsal-checkbox-grid">
                        <label className="nsal-check"><input type="checkbox" defaultChecked /> Informe de Campo</label>
                        <label className="nsal-check"><input type="checkbox" /> Presentación Oral</label>
                        <label className="nsal-check"><input type="checkbox" defaultChecked /> Bitácora de Campo</label>
                        <label className="nsal-check"><input type="checkbox" /> Base de Datos</label>
                    </div>
                </label>
            </fieldset>
        </div>
    );
}
