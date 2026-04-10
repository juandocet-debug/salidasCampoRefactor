import React, { useState } from 'react';

const CriterioCard = ({ numero, titulo, campo, valores, setValores }) => {
    const seleccionado = valores[campo]?.estado || 'PENDIENTE';
    const observacion = valores[campo]?.observacion || '';

    const botonestilos = (estadoActual, btnEstado) => {
        const esActivo = estadoActual === btnEstado;
        if (btnEstado === 'CUMPLE') return esActivo ? { background: '#0f172a', color: '#fff', borderColor: '#0f172a' } : { background: '#fff', color: '#1e293b' };
        if (btnEstado === 'PARCIAL') return esActivo ? { background: '#f59e0b', color: '#fff', borderColor: '#f59e0b' } : { background: '#fff', color: '#1e293b' };
        if (btnEstado === 'NO_CUMPLE') return esActivo ? { background: '#ef4444', color: '#fff', borderColor: '#ef4444' } : { background: '#fff', color: '#1e293b' };
        return {};
    };

    const actualizarValor = (key, val) => {
        setValores(prev => ({
            ...prev,
            [campo]: { ...prev[campo], [key]: val }
        }));
    };

    return (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
                <span style={{ background: '#3b82f6', color: '#fff', padding: '2px 6px', marginRight: '8px', borderRadius: '4px' }}>{numero}</span>
                {titulo}
            </h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button 
                    style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', ...botonestilos(seleccionado, 'CUMPLE') }}
                    onClick={() => actualizarValor('estado', 'CUMPLE')}>✓ CUMPLE</button>
                    
                <button 
                    style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', ...botonestilos(seleccionado, 'PARCIAL') }}
                    onClick={() => actualizarValor('estado', 'PARCIAL')}>⚠ PARCIAL</button>
                    
                <button 
                    style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', ...botonestilos(seleccionado, 'NO_CUMPLE') }}
                    onClick={() => actualizarValor('estado', 'NO_CUMPLE')}>✕ NO CUMPLE</button>
            </div>
            <textarea
                placeholder="Añadir observación o detalle..."
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }}
                value={observacion}
                onChange={(e) => actualizarValor('observacion', e.target.value)}
            />
        </div>
    );
};

export const RevisionPedagogicaPanel = ({ salida, onCerrar, isStatic = false }) => {
    const [criterios, setCriterios] = useState({
        pertinencia: { estado: 'PENDIENTE', observacion: '' },
        objetivos: { estado: 'PENDIENTE', observacion: '' },
        metodologia: { estado: 'PENDIENTE', observacion: '' },
        viabilidad: { estado: 'PENDIENTE', observacion: '' }
    });
    const [conceptoFinal, setConceptoFinal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!conceptoFinal) return alert("Debes seleccionar un concepto final.");

        const payload = {
            coordinador_id: 1, // Usuario logueado estático por ahora
            concepto_final: conceptoFinal,
            ...criterios
        };
        
        setLoading(true);
        try {
            const resp = await fetch(`http://localhost:8000/api/salidas/coordinacion/revision/${salida.id}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await resp.json();
            if (resp.ok) {
                alert("!Revisión pedagógica guardada con éxito!");
                onCerrar();
            } else {
                alert("Error del Backend: " + (data.error || "Petición inválida."));
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el backend.");
        } finally {
            setLoading(false);
        }
    };

    const baseStyle = isStatic 
        ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }
        : { position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', background: '#fff', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' };

    return (
        <div style={baseStyle}>
            {!isStatic && (
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Revisión Pedagógica</h2>
                    <button onClick={onCerrar} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>
            )}
            
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                {!isStatic && <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px' }}>Valide cada criterio pedagógico para <strong>{salida?.codigo || 'Salida'}</strong>.</p>}
                
                <CriterioCard numero="1." titulo="Pertinencia con Plan de Estudios" campo="pertinencia" valores={criterios} setValores={setCriterios} />
                <CriterioCard numero="2." titulo="Coherencia de Objetivos" campo="objetivos" valores={criterios} setValores={setCriterios} />
                <CriterioCard numero="3." titulo="Metodología Adecuada" campo="metodologia" valores={criterios} setValores={setCriterios} />
                <CriterioCard numero="4." titulo="Viabilidad del Itinerario" campo="viabilidad" valores={criterios} setValores={setCriterios} />

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', color: '#0f172a' }}>Concepto Final De Coordinación</h3>
                    <select 
                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', background: '#fff' }}
                        value={conceptoFinal}
                        onChange={(e) => setConceptoFinal(e.target.value)}
                    >
                        <option value="">Seleccione decisión...</option>
                        <option value="FAVORABLE">CONCEPTUAR FAVORABLE</option>
                        <option value="FAVORABLE_CON_AJUSTES">FAVORABLE CON AJUSTES</option>
                        <option value="NO_FAVORABLE">CONCEPTUAR NO FAVORABLE</option>
                    </select>
                </div>
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '14px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Validando e interconectando...' : 'GUARDAR REVISIÓN'}
                </button>
            </div>
        </div>
    );
};

export default RevisionPedagogicaPanel;
