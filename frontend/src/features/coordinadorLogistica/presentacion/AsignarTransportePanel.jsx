import React, { useState, useEffect } from 'react';
import { CardMatcha } from '../../../shared/componentes/generales/Tarjetas/Tarjetas';
import { EtiquetaPill, BotonAccion } from '../../../shared/componentes/generales/ElementosUX/ElementosUX';
import ModalConfirmar from '../../../shared/componentes/generales/ModalConfirmar/ModalConfirmar';
import { obtenerVehiculosDisponibles, asignarTransporteLogistica, limpiarAsignacionLogistica, obtenerEmpresasContratadas, obtenerConductoresPorEmpresa } from '../aplicacion/servicios';
import useAlertas from '../../../shared/estado/useAlertas';
import GestionEmpresasModal from './GestionEmpresas/GestionEmpresasModal';

const CustomCombobox = ({ value, onChange, options, placeholder, placeholderBusqueda, disabled }) => {
    const [open, setOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const wrapperRef = React.useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const opcionesFiltradas = options.filter(o => 
        !busqueda.trim() || o.label.toLowerCase().includes(busqueda.toLowerCase().trim())
    );

    const opcionSeleccionada = options.find(o => o.value?.toString() === value?.toString());

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
            <div 
                onClick={() => setOpen(!open)}
                style={{ 
                    padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                    background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', fontSize: '13px'
                }}
            >
                <span style={{ color: opcionSeleccionada ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {opcionSeleccionada ? opcionSeleccionada.label : placeholder}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>

            {open && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 50, maxHeight: '250px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text"
                            autoFocus
                            placeholder={placeholderBusqueda || "Buscar..."}
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            style={{ width: '100%', padding: '8px 8px 8px 30px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
                        {opcionesFiltradas.length === 0 ? (
                            <div style={{ padding: '10px 12px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>No hay coincidencias</div>
                        ) : (
                            opcionesFiltradas.map(o => (
                                <div 
                                    key={o.value}
                                    onClick={() => {
                                        onChange(o.value);
                                        setOpen(false);
                                        setBusqueda('');
                                    }}
                                    style={{ padding: '10px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px', background: value?.toString() === o.value?.toString() ? '#f1f5f9' : 'transparent', color: '#334155' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseOut={e => e.currentTarget.style.background = value?.toString() === o.value?.toString() ? '#f1f5f9' : 'transparent'}
                                >
                                    {o.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AsignarTransportePanel = ({ salida, onVolver }) => {
    const { agregarAlerta } = useAlertas();

    // Auto-detectar tipo de transporte según asignación existente
    const tipoInicial = () => {
        if (!salida?.empresa_asignada) return null;
        if (salida?.conductor_asignado === 'Conductor Institucional') return 'propio';
        return 'contratado';
    };
    const [tipoTransporte, setTipoTransporte] = useState(tipoInicial); // 'propio' | 'contratado'
    const [flotaInstitucional, setFlotaInstitucional] = useState([]);
    const [cargandoVehiculos, setCargandoVehiculos] = useState(false);
    const [asignando, setAsignando] = useState(false);
    const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState([]);
    const [vehiculoARemover, setVehiculoARemover] = useState(null);
    const [modalGestion, setModalGestion] = useState(false);
    const [confirmarBorrar, setConfirmarBorrar] = useState(false);
    const [limpiando, setLimpiando] = useState(false);
    
    const tieneAsignacionPrevia = salida?.estado === 'lista_ejecucion' && (salida?.empresa_asignada || salida?.conductor_asignado);
    const [modoEdicion, setModoEdicion] = useState(!tieneAsignacionPrevia);

    // Estados para formulario contratado
    const [empresasExternas, setEmpresasExternas] = useState([]);
    const [conductoresExternos, setConductoresExternos] = useState([]);
    const [busquedaEmpresa, setBusquedaEmpresa] = useState('');
    const [busquedaConductor, setBusquedaConductor] = useState('');
    const [formDataContratado, setFormDataContratado] = useState({
        empresa: '',          // se auto-completa por auto-match cuando cargan las empresas
        placa_vehiculo: '',
        costo: salida?.costo_estimado ? String(salida.costo_estimado) : '',
        contacto: ''          // se auto-completa por auto-match cuando cargan los conductores
    });

    const handleLimpiar = async () => {
        try {
            setLimpiando(true);
            await limpiarAsignacionLogistica(salida.id);
            agregarAlerta('Asignación eliminada. La salida vuelve a estado pendiente.', 'info');
            if (onVolver) onVolver();
        } catch (e) {
            agregarAlerta('Error al eliminar la asignación.', 'error');
        } finally {
            setLimpiando(false);
            setConfirmarBorrar(false);
        }
    };

    const handleAsignar = async (tipo_transporte, placa_o_empresa, conductor_o_contacto, costo_proyectado, volverAlListado = true, capacidad_asignada = 0) => {
        try {
            setAsignando(true);
            
            let finalPlacaOEmpresa = placa_o_empresa;
            let finalConductor = conductor_o_contacto;

            // Formatear nombres reales si viene de contratado
            if (tipo_transporte === 'contratado') {
                const empObj = empresasExternas.find(e => e.razon_social === placa_o_empresa || e.id.toString() === placa_o_empresa.toString());
                const nombreEmpresa = empObj ? empObj.razon_social : placa_o_empresa;
                
                const condObj = conductoresExternos.find(c => c.nombre === conductor_o_contacto || c.id.toString() === conductor_o_contacto.toString());
                const nombreConductor = condObj ? condObj.nombre : conductor_o_contacto;

                let externoInfo = formDataContratado.placa_vehiculo 
                    ? `${nombreEmpresa} (Placa: ${formDataContratado.placa_vehiculo})` 
                    : nombreEmpresa;
                
                let conductorExternoInfo = nombreConductor;

                // Si hay vehículos propios seleccionados en la sesión actual, o si ya venían de la BD
                let placasPropias = "";
                if (vehiculosSeleccionados.length > 0) {
                    placasPropias = vehiculosSeleccionados.map(v => v.placa).join(' / ');
                } else if (salida && salida.empresa_asignada) {
                    if (salida.conductor_asignado === 'Conductor Institucional') {
                        placasPropias = salida.empresa_asignada;
                    } else if (salida.empresa_asignada.includes('Flota UPN')) {
                        const match = salida.empresa_asignada.match(/Flota UPN \((.*?)\)/);
                        if (match) placasPropias = match[1];
                    }
                }

                if (placasPropias) {
                    finalPlacaOEmpresa = `Flota UPN (${placasPropias}) + ${externoInfo}`;
                    finalConductor = `Institucional + ${conductorExternoInfo}`;
                } else {
                    finalPlacaOEmpresa = externoInfo;
                    finalConductor = conductorExternoInfo;
                }
            }

            const payload = {
                salida_id: salida.id,
                tipo_transporte: tipo_transporte,
                placa_o_empresa: finalPlacaOEmpresa,
                conductor_o_contacto: finalConductor,
                costo_proyectado: costo_proyectado,
                capacidad_asignada: capacidad_asignada || 0
            };
            await asignarTransporteLogistica(payload);
            
            if(volverAlListado) {
                agregarAlerta("¡Transporte asignado correctamente!", 'exito');
                if(onVolver) onVolver();
            }
        } catch (error) {
            console.error("Error al asignar transporte:", error);
            agregarAlerta("Error al asignar transporte. Revisa la consola.", 'error');
            throw error; // Para capturarlo si es necesario
        } finally {
            setAsignando(false);
        }
    };

    const asignarVehiculoInmediato = async (v) => {
        try {
            const nuevos = [...vehiculosSeleccionados, v];
            const placas = nuevos.map(x => x.placa).join(' / ');
            const costoReal = parseFloat(salida?.costo_estimado) || 0;
            const capTotal = nuevos.reduce((sum, x) => sum + (parseInt(x.capacidad) || 0), 0);
            await handleAsignar('flota_propia', placas, 'Conductor Institucional', costoReal, false, capTotal);
            setVehiculosSeleccionados(nuevos);
            agregarAlerta(`¡El vehículo ${v.placa} ha sido asignado a la salida!`, 'exito');
        } catch (e) {
            // Error ya manejado en handleAsignar
        }
    };

    const confirmarRemocionVehiculo = async () => {
        if (!vehiculoARemover) return;
        try {
            const nuevos = vehiculosSeleccionados.filter(x => x.id !== vehiculoARemover.id);
            const placas = nuevos.length > 0 ? nuevos.map(x => x.placa).join(' / ') : 'Sin Asignar';
            const costoReal = parseFloat(salida?.costo_estimado) || 0;
            const capTotal = nuevos.reduce((sum, x) => sum + (parseInt(x.capacidad) || 0), 0);
            await handleAsignar('flota_propia', placas, 'Conductor Institucional', costoReal, false, capTotal);
            setVehiculosSeleccionados(nuevos);
            agregarAlerta(`Vehículo ${vehiculoARemover.placa} removido de la asignación.`, 'info');
        } catch (e) {
            // Manejado
        } finally {
            setVehiculoARemover(null);
        }
    };

    useEffect(() => {
        if (tipoTransporte === 'propio' && flotaInstitucional.length === 0) {
            setCargandoVehiculos(true);
            obtenerVehiculosDisponibles({
                fecha_inicio: salida?.fecha_inicio,
                fecha_fin: salida?.fecha_fin,
                salida_id: salida?.id
            })
                .then(data => {
                    if (Array.isArray(data)) {
                        const flota = data.filter(v => v.propietario === 'institucional');
                        setFlotaInstitucional(flota);

                        // Pre-cargar vehículos ya asignados si venimos de reasignar
                        if (vehiculosSeleccionados.length === 0 && salida?.empresa_asignada) {
                            // Extraer placas del string guardado: puede ser "ADFA" o "Flota UPN (GJGJH / ADFA)"
                            let placasGuardadas = salida.empresa_asignada;
                            const matchFlota = salida.empresa_asignada.match(/Flota UPN \((.+?)\)/);
                            if (matchFlota) placasGuardadas = matchFlota[1];

                            // Si es asignación mixta, tomar solo la parte antes del " + "
                            if (placasGuardadas.includes(' + ')) {
                                placasGuardadas = placasGuardadas.split(' + ')[0];
                                // Si esa parte aún tiene formato "Flota UPN (...)", extraer
                                const m2 = placasGuardadas.match(/Flota UPN \((.+?)\)/);
                                if (m2) placasGuardadas = m2[1];
                            }

                            const placasArray = placasGuardadas.split(' / ').map(p => p.trim());
                            const preSeleccionados = flota.filter(v => placasArray.includes(v.placa));
                            if (preSeleccionados.length > 0) {
                                setVehiculosSeleccionados(preSeleccionados);
                            }
                        }
                    }
                    setCargandoVehiculos(false);
                })
                .catch(err => {
                    console.error("Error obteniendo flota institucional:", err);
                    setCargandoVehiculos(false);
                });
        }
    }, [tipoTransporte, flotaInstitucional.length]);

    useEffect(() => {
        if (tipoTransporte === 'contratado') {
            obtenerEmpresasContratadas().then(data => setEmpresasExternas(data)).catch(console.error);
        }
    }, [tipoTransporte, modalGestion]); // Refrescar si se cierra el modal de gestión

    // Auto-matching: cuando cargan las empresas y hay asignación previa, matchear por nombre
    useEffect(() => {
        if (empresasExternas.length > 0 && salida?.empresa_asignada && tipoTransporte === 'contratado') {
            // La empresa guardada puede ser "Razón Social (Placa: ABC-123)" o solo "Razón Social"
            const match = empresasExternas.find(e =>
                salida.empresa_asignada === e.razon_social ||
                salida.empresa_asignada.startsWith(e.razon_social)
            );
            if (match) {
                const placaMatch = salida.empresa_asignada.match(/\(Placa:\s*(.+?)\)/);
                const placa = placaMatch ? placaMatch[1].trim() : '';
                setFormDataContratado(prev => ({
                    ...prev,
                    empresa: match.id.toString(),
                    placa_vehiculo: placa,
                }));
            }
        }
    }, [empresasExternas]);

    // Auto-matching: cuando cargan los conductores y hay asignación previa, matchear por nombre
    useEffect(() => {
        if (conductoresExternos.length > 0 && salida?.conductor_asignado && tipoTransporte === 'contratado') {
            const match = conductoresExternos.find(c =>
                c.nombre === salida.conductor_asignado ||
                salida.conductor_asignado.includes(c.nombre)
            );
            if (match) {
                setFormDataContratado(prev => ({
                    ...prev,
                    contacto: match.id.toString(),
                }));
            }
        }
    }, [conductoresExternos]);

    useEffect(() => {
        if (formDataContratado.empresa) {
            const empresaSeleccionada = empresasExternas.find(e => e.razon_social === formDataContratado.empresa || e.id.toString() === formDataContratado.empresa.toString());
            if (empresaSeleccionada) {
                obtenerConductoresPorEmpresa(empresaSeleccionada.id).then(data => setConductoresExternos(data)).catch(console.error);
            } else {
                setConductoresExternos([]);
            }
        } else {
            setConductoresExternos([]);
        }
    }, [formDataContratado.empresa, empresasExternas]);

    // Cálculos de capacidad
    const pasajerosRequeridos = (salida?.num_estudiantes || 0) + (salida?.num_docentes || 0);
    const capacidadAsignada = vehiculosSeleccionados.reduce((total, v) => total + (parseInt(v.capacidad) || 0), 0);
    const faltantes = Math.max(0, pasajerosRequeridos - capacidadAsignada);
    const porcentajeCubierto = pasajerosRequeridos > 0 ? Math.min(100, (capacidadAsignada / pasajerosRequeridos) * 100) : 100;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header con botón para volver */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <button 
                    onClick={onVolver}
                    className="herr-action-circle"
                    style={{ color: '#475569', background: '#f1f5f9', border: '1px solid #cbd5e1' }}
                    title="Volver al listado"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a' }}>Asignación Logística</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <code style={{ background: '#f1f5f9', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569', border: '1px solid #cbd5e1' }}>
                            {salida?.codigo || 'SAL-XXX'}
                        </code>
                        <span style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{salida?.nombre}</span>
                        {salida?.estado === 'lista_ejecucion'
                            ? <EtiquetaPill texto="Reasignar Vehículo" color="success" />
                            : <EtiquetaPill texto="Programar Vehículo" color="warning" />
                        }
                    </div>
                </div>
            </div>

            {/* Banner de asignación previa */}
            {tieneAsignacionPrevia && (
                <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: '700', fontSize: '14px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Transporte Asignado {modoEdicion && <span style={{ color: '#64748b', fontWeight: '500', fontSize: '13px', marginLeft: '4px' }}>— Modo edición activado</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                            {salida.empresa_asignada ? (
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                                    
                                    {/* Contenedor de Tarjetas Compactas de Transporte */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flex: 1 }}>
                                        {salida.empresa_asignada.split(' + ').flatMap((emp, i) => {
                                            const conds = salida.conductor_asignado?.split(' + ') || [];
                                            const empTrimmed = emp.trim();
                                            
                                            let nombreEmpresa = empTrimmed;
                                            let placaVehiculoRaw = '—';
                                            const matchFlota = empTrimmed.match(/^Flota UPN \((.+)\)$/);
                                            const matchContratado = empTrimmed.match(/^(.+?)\s*\(Placa:\s*(.+)\)$/);
                                            if (matchFlota) {
                                                nombreEmpresa = 'Flota UPN';
                                                placaVehiculoRaw = matchFlota[1];
                                            } else if (matchContratado) {
                                                nombreEmpresa = matchContratado[1];
                                                placaVehiculoRaw = matchContratado[2];
                                            }

                                            // Separar placas
                                            const placas = placaVehiculoRaw.split(' / ').map(p => p.trim());
                                            const conductorBase = conds[i]?.trim() || '—';

                                            return placas.map((placaIndiv, indexPlaca) => (
                                                <div key={`${i}-${indexPlaca}`} style={{ 
                                                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', 
                                                    padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px',
                                                    minWidth: '200px', flex: '1 1 auto', maxWidth: '300px'
                                                }}>
                                                    {/* Nombre de la empresa */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <svg style={{ flexShrink: 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                                        <span title={nombreEmpresa} style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombreEmpresa}</span>
                                                    </div>
                                                    
                                                    {/* Placa y conductor en una línea sutil */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                                                        <span title={placaIndiv} style={{ fontWeight: '700', color: '#3b82f6', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                                                            {placaIndiv}
                                                        </span>
                                                        <div style={{ width: '1px', height: '10px', background: '#cbd5e1' }}></div>
                                                        <span title={conductorBase} style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                            {conductorBase}
                                                        </span>
                                                    </div>
                                                </div>
                                            ));
                                        })}
                                    </div>

                                    {/* Costo Registrado al lado derecho */}
                                    {salida.costo_estimado > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: '#ecfdf5', border: '1px solid #d1fae5', padding: '10px 16px', borderRadius: '8px', flexShrink: 0 }}>
                                            <span style={{ fontSize: '10px', color: '#059669', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Costo Total Estimado</span>
                                            <span style={{ fontSize: '18px', color: '#047857', fontWeight: '800' }}>
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(salida.costo_estimado)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', padding: '10px 0' }}>No hay información de transporte detallada.</div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center', alignSelf: 'flex-start' }}>
                        {!modoEdicion && (
                            <BotonAccion
                                tipo="editar"
                                onClick={() => setModoEdicion(true)}
                                titulo="Habilitar edición de la asignación"
                            />
                        )}
                        <BotonAccion
                            tipo="borrar"
                            onClick={() => { if (!limpiando) setConfirmarBorrar(true); }}
                            titulo="Eliminar asignación y volver a estado pendiente"
                        />
                    </div>
                </div>
            )}

            {modoEdicion && (
                <>

            {/* Selector de Modalidad */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Modelo de Transporte</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {/* Tarjeta Flota Institucional */}
                    <div 
                        onClick={() => setTipoTransporte('propio')}
                        style={{ 
                            padding: '24px', 
                            border: tipoTransporte === 'propio' ? '2px solid #a855f7' : '1px solid #cbd5e1', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            background: tipoTransporte === 'propio' ? '#faf5ff' : '#fff', 
                            transition: 'all 0.2s ease', 
                            display: 'flex', alignItems: 'flex-start', gap: '16px' 
                        }}
                    >
                        <div style={{ padding: '12px', borderRadius: '10px', background: tipoTransporte === 'propio' ? '#f3e8ff' : '#f1f5f9', color: tipoTransporte === 'propio' ? '#9333ea' : '#64748b' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: tipoTransporte === 'propio' ? '#7e22ce' : '#334155', fontWeight: '600' }}>Flota Institucional</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Asignar conductores y vehículos propios de la universidad sujetos a disponibilidad del calendario.</p>
                        </div>
                    </div>

                    {/* Tarjeta Contratado */}
                    <div 
                        onClick={() => setTipoTransporte('contratado')}
                        style={{ 
                            padding: '24px', 
                            border: tipoTransporte === 'contratado' ? '2px solid #a855f7' : '1px solid #cbd5e1', 
                            borderRadius: '12px', 
                            cursor: 'pointer', 
                            background: tipoTransporte === 'contratado' ? '#faf5ff' : '#fff', 
                            transition: 'all 0.2s ease', 
                            display: 'flex', alignItems: 'flex-start', gap: '16px' 
                        }}
                    >
                        <div style={{ padding: '12px', borderRadius: '10px', background: tipoTransporte === 'contratado' ? '#f3e8ff' : '#f1f5f9', color: tipoTransporte === 'contratado' ? '#9333ea' : '#64748b' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M14 8h-1"/><path d="M14 12h-1"/><path d="M14 16h-1"/></svg>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: tipoTransporte === 'contratado' ? '#7e22ce' : '#334155', fontWeight: '600' }}>Outsourcing (Contratado)</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>Registrar logística externa para salidas sin cobertura institucional. Afecta pólizas y presupuesto (recargo 1.3x).</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vistas Dinámicas */}
            {tipoTransporte === 'propio' && (
                <div className="fade-in" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Parque Automotor Disponible</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Coincidencias en el rango de fechas de la salida.</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {cargandoVehiculos ? (
                            <div className="herr-vacio" style={{ gridColumn: '1 / -1' }}>Cargando vehículos disponibles...</div>
                        ) : flotaInstitucional.length === 0 ? (
                            <div className="herr-vacio" style={{ gridColumn: '1 / -1' }}>No hay vehículos propios disponibles. Requiere contratación externa.</div>
                        ) : flotaInstitucional
                            // Ocultar los que ya están seleccionados para no duplicarlos
                            .filter(v => !vehiculosSeleccionados.some(x => x.id === v.id))
                            .map(v => {
                            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                            const fotoSrc = v.foto_url
                                ? (v.foto_url.startsWith('http') ? v.foto_url : `${API_BASE}${v.foto_url}`)
                                : (['buseta', 'microbus', 'camioneta', 'furgon'].includes(String(v.tipo).toLowerCase()) 
                                    ? 'https://cdn3d.iconscout.com/3d/premium/thumb/minivan-6780879-5573489.png'
                                    : 'https://cdn3d.iconscout.com/3d/premium/thumb/bus-6780880-5573490.png');

                            const tipoStr = String(v.tipo).toLowerCase();
                            const cardColor = tipoStr === 'bus' ? 'blue' : 
                                              tipoStr === 'buseta' ? 'sky' : 
                                              tipoStr === 'microbus' ? 'cyan' : 
                                              tipoStr === 'camioneta' ? 'slate' : 'indigo';

                            const isSelected = vehiculosSeleccionados.some(x => x.id === v.id);
                            return (
                                <div 
                                    key={v.id}
                                    onClick={() => {
                                        if (v.estado_tecnico === 'disponible' && !asignando && !isSelected) {
                                            asignarVehiculoInmediato(v);
                                        }
                                    }}
                                    style={{ 
                                        cursor: (v.estado_tecnico !== 'disponible' || asignando || isSelected) ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        transform: (v.estado_tecnico === 'disponible' && !asignando && !isSelected) ? 'scale(0.99)' : 'none',
                                        border: isSelected ? '2px solid #10b981' : '2px solid transparent',
                                        borderRadius: '16px',
                                        padding: '2px' // Espacio para el borde
                                    }}
                                >
                                    <CardMatcha 
                                        title={v.placa}
                                        color={cardColor}
                                        badgeText={v.estado_tecnico?.toUpperCase()}
                                        badgeColor={v.estado_tecnico === 'disponible' ? '#10b981' : (v.estado_tecnico === 'mantenimiento' ? '#ef4444' : '#f59e0b')}
                                        imageSrc={fotoSrc}
                                        bannerText={`${v.capacidad} Puestos - ${v.tipo}`}
                                        tags={v.tipo_combustible ? [`Motor ${v.tipo_combustible}`] : []}
                                        actions={
                                            <div style={{ 
                                                width: '100%', textAlign: 'center', padding: '8px 12px', boxSizing: 'border-box', fontSize: '13px', fontWeight: 'bold',
                                                color: v.estado_tecnico !== 'disponible' ? '#94a3b8' : (isSelected ? '#10b981' : '#6366f1'),
                                                background: v.estado_tecnico !== 'disponible' ? '#f8fafc' : (isSelected ? '#d1fae5' : '#e0e7ff'),
                                                borderRadius: '6px'
                                            }}>
                                                {v.estado_tecnico !== 'disponible' 
                                                    ? 'No Disponible' 
                                                    : (isSelected ? 'Asignado a la Salida' : (asignando ? 'Asignando...' : 'Haz clic para asignar'))}
                                            </div>
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Resumen de Selección (Tabla) */}
                    {vehiculosSeleccionados.length > 0 && (
                        <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
                                <h4 style={{ margin: '0', color: '#16a34a', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Asignación Activa Confirmada
                                </h4>
                                
                                {/* Medidor de Capacidad */}
                                <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', minWidth: '320px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ color: '#475569', fontSize: '13px', fontWeight: '600' }}>Cobertura de Pasajeros</span>
                                        <span style={{ color: faltantes > 0 ? '#ea580c' : '#10b981', fontSize: '14px', fontWeight: 'bold' }}>
                                            {capacidadAsignada} / {pasajerosRequeridos}
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                                        <div style={{ width: `${porcentajeCubierto}%`, height: '100%', background: faltantes > 0 ? '#f59e0b' : '#10b981', transition: 'width 0.4s ease' }}></div>
                                    </div>
                                    
                                    {faltantes > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <span style={{ color: '#ea580c', fontSize: '12px', background: '#fff7ed', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                Faltan {faltantes} puestos por cubrir
                                            </span>
                                            <button 
                                                onClick={() => setTipoTransporte('contratado')}
                                                style={{ 
                                                    background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(234, 88, 12, 0.25)', transition: 'background 0.2s ease', width: '100%'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#c2410c'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#ea580c'}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                Completar con Contratado
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ width: '100%', color: '#15803d', fontSize: '13px', textAlign: 'center', background: '#f0fdf4', padding: '10px', borderRadius: '6px', border: '1px solid #dcfce7', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            ¡Cupo total cubierto!
                                        </span>
                                    )}
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontSize: '13px', fontWeight: '600' }}>Placa</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontSize: '13px', fontWeight: '600' }}>Tipo</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontSize: '13px', fontWeight: '600' }}>Capacidad</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', color: '#475569', fontSize: '13px', fontWeight: '600' }}>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehiculosSeleccionados.map(vehiculo => (
                                        <tr key={vehiculo.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{vehiculo.placa}</td>
                                            <td style={{ padding: '16px', color: '#475569', textTransform: 'capitalize' }}>{vehiculo.tipo}</td>
                                            <td style={{ padding: '16px', color: '#475569' }}>{vehiculo.capacidad} Pasajeros</td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => setVehiculoARemover(vehiculo)}
                                                    style={{ background: 'transparent', border: '1px solid #ef4444', borderRadius: '6px', padding: '6px 12px', color: '#ef4444', cursor: 'pointer', fontWeight: '500', fontSize: '12px' }}
                                                    disabled={asignando}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
                                * Puedes seleccionar múltiples vehículos si la salida lo requiere. Para quitar uno, haz clic en "Eliminar".
                            </div>
                        </div>
                    )}

                    {vehiculoARemover && (
                        <ModalConfirmar
                            titulo="Remover asignación"
                            descripcion={<span>¿Deseas remover el vehículo <strong>{vehiculoARemover.placa}</strong> de esta asignación?</span>}
                            labelConfirmar="Sí, remover"
                            cargando={asignando}
                            onConfirmar={confirmarRemocionVehiculo}
                            onCancelar={() => setVehiculoARemover(null)}
                        />
                    )}
                </div>
            )}

            {tipoTransporte === 'contratado' && (
                <div className="fade-in" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Registro de Proveedor Externo</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '6px' }}>
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Empresa / Razón Social <span style={{color: 'red'}}>*</span></span>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <CustomCombobox
                                        options={empresasExternas.map(e => ({ value: e.id, label: e.razon_social }))}
                                        value={formDataContratado.empresa}
                                        onChange={(val) => setFormDataContratado({...formDataContratado, empresa: val, contacto: ''})}
                                        placeholder="Seleccione una empresa..."
                                        placeholderBusqueda="Buscar empresa..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setModalGestion(true)}
                                        title="Gestionar empresas y conductores registrados"
                                        style={{ width: '44px', height: '44px', flexShrink: 0, background: '#ede9fe', border: '1px solid #ddd6fe', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', transition: 'background 0.15s' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#ddd6fe'}
                                        onMouseOut={e => e.currentTarget.style.background = '#ede9fe'}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '6px' }}>
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Conductor Asignado</span>
                                <CustomCombobox
                                    options={conductoresExternos.map(c => ({ value: c.id, label: `${c.nombre} - CC ${c.cedula}` }))}
                                    value={formDataContratado.contacto}
                                    onChange={(val) => setFormDataContratado({...formDataContratado, contacto: val})}
                                    placeholder={conductoresExternos.length === 0 && formDataContratado.empresa ? 'Sin conductores...' : 'Seleccione conductor...'}
                                    placeholderBusqueda="Buscar conductor..."
                                    disabled={!formDataContratado.empresa || conductoresExternos.length === 0}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Placa</label>
                            <input 
                                type="text" 
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }} 
                                placeholder="Ej: ABC-123" 
                                value={formDataContratado.placa_vehiculo}
                                onChange={(e) => setFormDataContratado({...formDataContratado, placa_vehiculo: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Costo Proyectado Cotizado <span style={{color: 'red'}}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8', fontWeight: '500' }}>$</span>
                                <input 
                                    type="number" 
                                    style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }} 
                                    placeholder="0.00" 
                                    value={formDataContratado.costo}
                                    onChange={(e) => setFormDataContratado({...formDataContratado, costo: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '20px', padding: '16px', background: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #f59e0b', fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <div>
                            <strong>Impacto Presupuestal:</strong> Al confirmar esta asignación, el costo final descontado de la bolsa de la facultad incluirá el sobrecosto contractual y seguros exigidos por la institución.
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            className="herr-btn"
                            disabled={asignando || !formDataContratado.empresa || !formDataContratado.costo}
                            onClick={() => {
                                // Capacidad total: flota propia ya seleccionada + pasajeros que cubre la empresa externa
                                const capPropia = vehiculosSeleccionados.reduce((s, v) => s + (parseInt(v.capacidad) || 0), 0);
                                const capTotal = pasajerosRequeridos; // Al contratar una empresa asumimos que cubre el total
                                handleAsignar('contratado', formDataContratado.empresa, formDataContratado.contacto, parseFloat(formDataContratado.costo), true, capTotal);
                            }}
                        >
                            {asignando ? 'Asignando...' : 'Confirmar Asignación Externa'}
                        </button>
                    </div>
                </div>
            )}
            </>
            )}
            <style>{`
                .fade-in { animation: fadeIn 0.3s ease forwards; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input:focus { border-color: #a855f7 !important; box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15); }
            `}</style>

            {/* Modal Gestión de Empresas y Conductores */}
            {modalGestion && <GestionEmpresasModal onCerrar={() => setModalGestion(false)} />}

            {/* Modal confirmación borrar asignación */}
            {confirmarBorrar && (
                <ModalConfirmar
                    titulo="Borrar asignación de transporte"
                    descripcion={<span>¿Estás seguro de que deseas <strong>eliminar</strong> la asignación de transporte de esta salida? La salida volverá al estado <strong>Pendiente</strong>.</span>}
                    labelConfirmar="Sí, borrar asignación"
                    cargando={limpiando}
                    onConfirmar={handleLimpiar}
                    onCancelar={() => setConfirmarBorrar(false)}
                />
            )}
        </div>
    );
};

export default AsignarTransportePanel;
