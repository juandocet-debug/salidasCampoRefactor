import React, { useState } from 'react';
import useAlertas from '@/shared/estado/useAlertas';

const CriterioCard = ({ numero, titulo, campo, valores, setValores, isExpanded, isReadOnly }) => {
    const seleccionado = valores[campo]?.estado || 'PENDIENTE';
    const observacion = valores[campo]?.observacion || '';

    const botonestilos = (estadoActual, btnEstado) => {
        const esActivo = estadoActual === btnEstado;
        if (btnEstado === 'CUMPLE') return esActivo ? { background: '#10b981', color: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' } : { background: '#f1f5f9', color: '#64748b', border: '1px solid transparent' };
        if (btnEstado === 'PARCIAL') return esActivo ? { background: '#f59e0b', color: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)' } : { background: '#f1f5f9', color: '#64748b', border: '1px solid transparent' };
        if (btnEstado === 'NO_CUMPLE') return esActivo ? { background: '#ef4444', color: '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)' } : { background: '#f1f5f9', color: '#64748b', border: '1px solid transparent' };
        return {};
    };

    const actualizarValor = (key, val) => {
        setValores(prev => ({
            ...prev,
            [campo]: { ...prev[campo], [key]: val }
        }));
    };

    return (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', transition: 'box-shadow 0.2s, border-color 0.2s', ...((seleccionado !== 'PENDIENTE') ? { borderColor: '#cbd5e1' } : {}) }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', marginRight: '12px' }}>
                    {numero}
                </div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
                    {titulo}
                </h4>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button 
                    style={{ flex: 1, padding: '10px 0', borderRadius: '8px', cursor: isReadOnly ? 'default' : 'pointer', fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s', opacity: (isReadOnly && seleccionado !== 'CUMPLE') ? 0.3 : 1, ...botonestilos(seleccionado, 'CUMPLE') }}
                    onClick={() => !isReadOnly && actualizarValor('estado', 'CUMPLE')}>✓ CUMPLE</button>
                    
                <button 
                    style={{ flex: 1, padding: '10px 0', borderRadius: '8px', cursor: isReadOnly ? 'default' : 'pointer', fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s', opacity: (isReadOnly && seleccionado !== 'PARCIAL') ? 0.3 : 1, ...botonestilos(seleccionado, 'PARCIAL') }}
                    onClick={() => !isReadOnly && actualizarValor('estado', 'PARCIAL')}>⚠ PARCIAL</button>
                    
                <button 
                    style={{ flex: 1, padding: '10px 0', borderRadius: '8px', cursor: isReadOnly ? 'default' : 'pointer', fontWeight: '700', fontSize: '11px', letterSpacing: '0.5px', transition: 'all 0.2s', opacity: (isReadOnly && seleccionado !== 'NO_CUMPLE') ? 0.3 : 1, ...botonestilos(seleccionado, 'NO_CUMPLE') }}
                    onClick={() => !isReadOnly && actualizarValor('estado', 'NO_CUMPLE')}>✕ NO</button>
            </div>
            
            <div style={{ position: 'relative' }}>
                <textarea
                    placeholder={isReadOnly ? "Sin detalles registrados." : "Escriba aquí los detalles o justificación de su calificación..."}
                    style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e2e8f0', background: isReadOnly ? '#f1f5f9' : '#f8fafc', borderRadius: '8px', fontSize: '13px', minHeight: '80px', resize: 'none', color: '#334155', transition: 'border-color 0.2s, background 0.2s', fontFamily: 'inherit' }}
                    value={observacion}
                    readOnly={isReadOnly}
                    onChange={(e) => !isReadOnly && actualizarValor('observacion', e.target.value)}
                    onFocus={(e) => { if (!isReadOnly) { e.target.style.background = '#fff'; e.target.style.borderColor = '#94a3b8'; e.target.style.outline = 'none'; } }}
                    onBlur={(e) => { if (!isReadOnly) { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e2e8f0'; } }}
                />
            </div>
        </div>
    );
};

export const RevisionPedagogicaPanel = ({ salida, onCerrar, isStatic = false, isExpanded = false }) => {
    const estadosEditables = ['ENVIADA', 'EN_REVISION', 'AJUSTADA'];
    const isReadOnly = salida?.estado && !estadosEditables.includes(salida.estado.toUpperCase());

    const [criterios, setCriterios] = useState(() => {
        if (salida?.ultima_revision) {
            return {
                pertinencia: salida.ultima_revision.pertinencia || { estado: 'PENDIENTE', observacion: '' },
                objetivos: salida.ultima_revision.objetivos || { estado: 'PENDIENTE', observacion: '' },
                metodologia: salida.ultima_revision.metodologia || { estado: 'PENDIENTE', observacion: '' },
                viabilidad: salida.ultima_revision.viabilidad || { estado: 'PENDIENTE', observacion: '' }
            };
        }
        return {
            pertinencia: { estado: 'PENDIENTE', observacion: '' },
            objetivos: { estado: 'PENDIENTE', observacion: '' },
            metodologia: { estado: 'PENDIENTE', observacion: '' },
            viabilidad: { estado: 'PENDIENTE', observacion: '' }
        };
    });
    
    const [conceptoFinal, setConceptoFinal] = useState(salida?.ultima_revision?.concepto_final || '');
    const [loading, setLoading] = useState(false);

    const { agregarAlerta } = useAlertas();

    const handleSubmit = async () => {
        if (!conceptoFinal) return agregarAlerta("Debes seleccionar un concepto final.", "advertencia");

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
                agregarAlerta("¡Revisión pedagógica guardada con éxito!", "exito");
                onCerrar();
            } else {
                agregarAlerta("Error del Backend: " + (data.error || "Petición inválida."), "error");
            }
        } catch (error) {
            console.error(error);
            agregarAlerta("Error de conexión con el backend.", "error");
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
                
                <div style={{ display: isExpanded ? 'grid' : 'block', gridTemplateColumns: isExpanded ? '1fr 1fr' : 'none', gap: isExpanded ? '20px' : '0' }}>
                    <CriterioCard numero="1." titulo="Pertinencia con Plan de Estudios" campo="pertinencia" valores={criterios} setValores={setCriterios} isExpanded={isExpanded} isReadOnly={isReadOnly} />
                    <CriterioCard numero="2." titulo="Coherencia de Objetivos" campo="objetivos" valores={criterios} setValores={setCriterios} isExpanded={isExpanded} isReadOnly={isReadOnly} />
                    <CriterioCard numero="3." titulo="Metodología Adecuada" campo="metodologia" valores={criterios} setValores={setCriterios} isExpanded={isExpanded} isReadOnly={isReadOnly} />
                    <CriterioCard numero="4." titulo="Viabilidad del Itinerario" campo="viabilidad" valores={criterios} setValores={setCriterios} isExpanded={isExpanded} isReadOnly={isReadOnly} />
                </div>

                <div style={{ marginTop: '30px', padding: '24px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', color: '#1e3a8a', fontWeight: 'bold' }}>
                        CONCEPTO TÉCNICO OFICIAL
                    </h3>
                    <div style={{ position: 'relative' }}>
                        <select 
                            disabled={isReadOnly}
                            style={{ 
                                width: '100%', padding: '14px 16px', borderRadius: '8px', border: '2px solid #93c5fd', 
                                fontSize: '14px', fontWeight: '700', color: '#1e3a8a', background: isReadOnly ? '#f1f5f9' : '#fff', 
                                appearance: 'none', cursor: isReadOnly ? 'default' : 'pointer', outline: 'none', fontFamily: 'inherit'
                             }}
                            value={conceptoFinal}
                            onChange={(e) => setConceptoFinal(e.target.value)}
                        >
                            <option value="">Seleccione decisión final...</option>
                            <option value="FAVORABLE">CONCEPTUAR FAVORABLE</option>
                            <option value="FAVORABLE_CON_AJUSTES">FAVORABLE CON AJUSTES</option>
                            <option value="NO_FAVORABLE">CONCEPTUAR NO FAVORABLE</option>
                        </select>
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#3b82f6', fontSize: '12px' }}>▼</div>
                    </div>
                </div>
            </div>

            {!isReadOnly && (
                <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', background: '#fff', position: 'sticky', bottom: 0, zIndex: 10 }}>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading || !conceptoFinal}
                        style={{ 
                            width: '100%', 
                            background: loading || !conceptoFinal ? '#cbd5e1' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
                            color: '#fff', 
                            padding: '16px', 
                            fontSize: '14px', 
                            fontWeight: '800', 
                            border: 'none', 
                            borderRadius: '10px', 
                            cursor: loading || !conceptoFinal ? 'not-allowed' : 'pointer',
                            boxShadow: loading || !conceptoFinal ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
                            transition: 'all 0.2s',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            fontFamily: 'inherit'
                        }}>
                        {loading ? 'Procesando concepto...' : 'Guardar Revisión Oficial'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RevisionPedagogicaPanel;
