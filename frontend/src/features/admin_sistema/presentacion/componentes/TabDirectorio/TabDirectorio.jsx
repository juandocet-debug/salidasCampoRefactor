import React, { useState, useEffect, useRef } from 'react';
import { directorioService } from '../../../api/directorio.service';
import './TabDirectorio.css';

export default function TabDirectorio({ token, onToast }) {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const cargarHistorial = async () => {
        try {
            setCargando(true);
            const data = await directorioService.listarHistorial(token);
            setHistorial(data);
        } catch (err) {
            setError('Error al cargar el historial de archivos.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.name.endsWith('.csv')) {
                setError('Solo se aceptan archivos en formato .csv');
                setArchivoSeleccionado(null);
                return;
            }
            setError('');
            setArchivoSeleccionado(file);
        }
    };

    const handleUpload = async () => {
        if (!archivoSeleccionado) return;
        setSubiendo(true);
        setError('');
        try {
            const res = await directorioService.cargarDirectorio(archivoSeleccionado, token);
            onToast(`✅ Carga exitosa: ${res.cargados} credenciales creadas.`);
            setArchivoSeleccionado(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            await cargarHistorial();
        } catch (err) {
            setError(err.message || 'Ocurrió un error inesperado al subir el archivo.');
        } finally {
            setSubiendo(false);
        }
    };

    const handleEliminar = async (cargaId) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta carga? Los estudiantes asociados no podrán iniciar sesión.')) {
            return;
        }
        try {
            await directorioService.eliminarCarga(cargaId, token);
            onToast('🗑️ Carga eliminada correctamente');
            await cargarHistorial();
        } catch (err) {
            onToast('❌ Error al eliminar: ' + err.message);
        }
    };

    const formatearFecha = (fechaStr) => {
        return new Date(fechaStr).toLocaleString('es-CO', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="tab-dir-container">
            {/* Encabezado y Acción de Subida */}
            <div className="tab-dir-header-card">
                <div className="tab-dir-title-area">
                    <h3>Directorio de Estudiantes (CSV)</h3>
                    <p>Sube el padrón de estudiantes matriculados para permitirles el acceso.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <div className="tab-dir-upload-actions">
                        <input 
                            type="file" 
                            accept=".csv" 
                            className="tab-dir-file-input" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button 
                            className="tab-dir-btn-select" 
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Seleccionar CSV
                        </button>

                        {archivoSeleccionado && (
                            <span className="tab-dir-file-name" title={archivoSeleccionado.name}>
                                {archivoSeleccionado.name}
                            </span>
                        )}

                        <button 
                            className="tab-dir-btn-submit"
                            onClick={handleUpload}
                            disabled={!archivoSeleccionado || subiendo}
                        >
                            {subiendo ? 'Procesando...' : 'Procesar Carga'}
                        </button>
                    </div>
                    {error && <div className="tab-dir-error-msg">{error}</div>}
                </div>
            </div>

            {/* Tabla Historial */}
            <div className="tab-dir-table-card">
                <table className="tab-dir-table">
                    <thead>
                        <tr>
                            <th>Archivo</th>
                            <th>Fecha</th>
                            <th>Registros</th>
                            <th>Cargados</th>
                            <th>Duplicados</th>
                            <th>Errores</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Cargando historial de cargas...</td>
                            </tr>
                        ) : historial.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="tab-dir-empty">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" style={{ marginBottom: '12px' }}>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    <h3>No hay cargas en el historial</h3>
                                    <p>Sube tu primer archivo CSV para crear el directorio activo.</p>
                                </td>
                            </tr>
                        ) : (
                            historial.map(carga => (
                                <tr key={carga.id}>
                                    <td style={{ fontWeight: 600, color: '#334155' }}>{carga.nombre_archivo}</td>
                                    <td>{formatearFecha(carga.fecha_carga)}</td>
                                    <td>{carga.total_registros}</td>
                                    <td style={{ color: '#10b981', fontWeight: 600 }}>{carga.cargados}</td>
                                    <td style={{ color: '#f59e0b', fontWeight: 600 }}>{carga.duplicados}</td>
                                    <td style={{ color: carga.errores > 0 ? '#ef4444' : '#1e293b', fontWeight: carga.errores > 0 ? 600 : 500 }}>
                                        {carga.errores}
                                    </td>
                                    <td>
                                        {carga.activa ? (
                                            <span className="badge-active">Directorio Activo</span>
                                        ) : (
                                            <span className="badge-inactive">Inactivo</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button 
                                            className="tab-dir-btn-delete"
                                            onClick={() => handleEliminar(carga.id)}
                                            title="Eliminar carga y revocar acceso a estos estudiantes"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
