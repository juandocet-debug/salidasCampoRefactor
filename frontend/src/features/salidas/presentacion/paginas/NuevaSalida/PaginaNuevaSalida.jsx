import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAutenticacion from '@/shared/hooks/useAutenticacion';
import useAlertas from '@/shared/estado/useAlertas';
import { validarPaso, construirPayload, parsearErrorDRF } from '@/features/salidas/dominio/reglas';
import { cargarSalidaParaEdicion, enviarSalida } from '@/features/salidas/aplicacion/servicios';
import './PaginaNuevaSalida.css';

import Paso1Informacion from '@/features/salidas/presentacion/componentes/pasos/Paso1Informacion/Paso1Informacion';
import Paso2Planeacion from '@/features/salidas/presentacion/componentes/pasos/Paso2Planeacion/Paso2Planeacion';
import Paso3Logistica from '@/features/salidas/presentacion/componentes/pasos/Paso3Logistica/Paso3Logistica';
import Paso4Evaluacion from '@/features/salidas/presentacion/componentes/pasos/Paso4Evaluacion/Paso4Evaluacion';
import StepperNuevaSalida from '@/features/salidas/presentacion/componentes/pasos/StepperNuevaSalida/StepperNuevaSalida';

const ETAPAS = [
    { id: 1, label: 'Información', desc: 'Datos y justificación' },
    { id: 2, label: 'Planeación', desc: 'Objetivos y metodología' },
    { id: 3, label: 'Logística', desc: 'Ruta y entregables' },
    { id: 4, label: 'Evaluación', desc: 'Criterios de éxito' }
];

const FORM_INICIAL = {
    nombre: '', asignatura: '', semestre: '2026-1', facultad: '', programa: '',
    num_estudiantes: '', fecha_inicio: '', fecha_fin: '',
    hora_inicio: '', hora_fin: '',
    justificacion: '', resumen: '', relacion_syllabus: '',
    icono: 'IcoMountain', color: '#16a34a',
    objetivo_general: '', objetivos_especificos: '', estrategia_metodologica: '',
    punto_partida: 'Universidad Nacional, Bogotá', parada_max: '',
    productos_esperados: '', criterios_evaluacion: '',
    // Datos de cálculo de costo (persistidos)
    distancia_total_km: 0, duracion_dias: 1, horas_viaje: 9, costo_estimado: 0,
    tipo_vehiculo_calculo: 'bus',
};

export default function PaginaNuevaSalida() {
    const { token } = useAutenticacion();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editarId = searchParams.get('editar');
    const { agregarAlerta } = useAlertas();
    const [cargando, setCargando] = useState(false);
    const [pasoActivo, setPasoActivo] = useState(1);
    const [form, setForm] = useState(FORM_INICIAL);
    const [esGrupal, setEsGrupal] = useState(false);
    const [profesoresAsociados, setProfesoresAsociados] = useState([]);

    // ── Cargar datos para edición ────────────────────────────────────────
    useEffect(() => {
        if (!editarId) return;
        setCargando(true);
        cargarSalidaParaEdicion(editarId, token)
            .then(({ formData, esGrupal: eg, profesoresAsociados: pa }) => {
                setForm(prev => ({ ...prev, ...formData }));
                setEsGrupal(eg);
                setProfesoresAsociados(pa);
            })
            .catch(() => {
                agregarAlerta('No se pudo cargar la salida para editar.', 'error');
                navigate('/tablero');
            })
            .finally(() => setCargando(false));
    }, [editarId, token, navigate, agregarAlerta]);

    // ── Navegación entre pasos ───────────────────────────────────────────
    const validarPasoActual = () => validarPaso(pasoActivo, form);

    const handleSiguiente = () => {
        const err = validarPasoActual();
        if (err) { agregarAlerta(`Cuidado (Paso ${pasoActivo}): ${err}`, 'advertencia'); return; }
        setPasoActivo(p => Math.min(p + 1, 4));
    };

    const handleAnterior = () => setPasoActivo(p => Math.max(p - 1, 1));

    // ── Envío del formulario ─────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        const errVal = validarPasoActual();
        if (errVal) { agregarAlerta(`Falta completar en el paso ${pasoActivo}: ${errVal}`, 'advertencia'); return; }
        if (!form.criterios_evaluacion.trim()) {
            agregarAlerta('Cuidado (Paso 4): Defina los criterios de evaluación para Finalizar.', 'advertencia');
            return;
        }

        setCargando(true);
        try {
            const payload = construirPayload(form, esGrupal, profesoresAsociados);
            console.error("=== PAYLOAD FRONTEND ENVIADO ===", JSON.stringify(payload.puntos_ruta_data));
            const msg = await enviarSalida(editarId, payload, token);
            agregarAlerta(msg, 'exito');
            navigate('/tablero');
        } catch (err) {
            agregarAlerta(parsearErrorDRF(err), 'error');
        } finally {
            setCargando(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (pasoActivo < 4) handleSiguiente();
        }
    };

    // ── Render ───────────────────────────────────────────────────────────
    return (
        <div className="nsal-contenedor fade-in">
            <StepperNuevaSalida
                ETAPAS={ETAPAS}
                pasoActivo={pasoActivo}
                setPasoActivo={setPasoActivo}
                onVolver={() => navigate('/tablero')}
            />

            <div className="nsal-form-body" onKeyDown={handleKeyDown}>


                {pasoActivo === 1 && <Paso1Informacion
                    form={form} setForm={setForm}
                    esGrupal={esGrupal} setEsGrupal={setEsGrupal}
                    profesoresAsociados={profesoresAsociados}
                    setProfesoresAsociados={setProfesoresAsociados}
                />}
                {pasoActivo === 2 && <Paso2Planeacion form={form} setForm={setForm} />}
                {pasoActivo === 3 && <Paso3Logistica form={form} setForm={setForm} />}
                {pasoActivo === 4 && <Paso4Evaluacion form={form} setForm={setForm} />}

                <div className="nsal-footer">
                    {pasoActivo > 1 ? (
                        <button type="button" className="nsal-btn-secundario" onClick={handleAnterior}>← Anterior</button>
                    ) : <div></div>}

                    {pasoActivo < 4 ? (
                        <button type="button" className="nsal-btn-primario" onClick={handleSiguiente}>Siguiente →</button>
                    ) : (
                        <button type="button" className="nsal-btn-final" disabled={cargando} onClick={handleSubmit}>
                            {cargando ? 'Guardando...' : 'Finalizar y Guardar ✔'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
