// src/App.jsx
// ─────────────────────────────────────────────────────────────────
// ENRUTADOR RAÍZ — Define todas las rutas de la aplicación.
// Rutas públicas: /login
// Rutas protegidas: todo lo demás (bajo Layout)
// ─────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from 'react-router-dom';
import useAutenticacion from './modulos/autenticacion/estado/useAutenticacion';
import RutasProtegidas from './rutas/RutasProtegidas';
import Layout from './nucleo/componentes/Layout/Layout';
import GlobalAlerts from './nucleo/componentes/Alertas/GlobalAlerts';

// ── Importación directa de módulos ────────────────────
import PaginaLogin from './modulos/autenticacion/paginas/PaginaLogin';
import PaginaTablero from './modulos/tablero/paginas/PaginaTablero';
import PaginaHistorico from './modulos/profesor/paginas/PaginaHistorico';
import PaginaNuevaSalida from './modulos/profesor/paginas/PaginaNuevaSalida';
import PanelHerramientas from './modulos/admin/paginas/PanelHerramientas';
import PaginaVerificacionAbordaje from './funcionalidades/abordaje/paginas/PaginaVerificacionAbordaje';
import PaginaCodigoEstudiante from './funcionalidades/abordaje/paginas/PaginaCodigoEstudiante';

// ── Fallback de carga ─────────────────────────────────────────────
function Cargando() {
  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: 'var(--cyan-400)',
      fontSize: '1rem', fontFamily: 'var(--fuente)'
    }}>
      Cargando OTIUM...
    </div>
  );
}

export default function App() {
  const usuario = useAutenticacion(s => s.usuario);
  const cerrarSesion = useAutenticacion(s => s.cerrarSesion);

  return (
    <>
      <GlobalAlerts />
      <Routes>

        {/* ── Rutas públicas ──────────────────────────────────────── */}
        <Route path="/login" element={<PaginaLogin />} />

        {/* ── Rutas protegidas (requieren JWT) ──────────────────── */}
        <Route element={<RutasProtegidas />}>
          <Route element={<Layout usuario={usuario} onCerrarSesion={cerrarSesion} />}>

            {/* Tablero principal */}
            <Route path="/tablero" element={<PaginaTablero />} />

            {/* Rutas Fases */}
            <Route path="/salidas" element={<PaginaTablero />} />
            <Route path="/nueva-salida" element={<PaginaNuevaSalida />} />
            <Route path="/revisiones" element={<PaginaTablero />} />
            <Route path="/decisiones" element={<PaginaTablero />} />
            <Route path="/historial" element={<PaginaTablero />} />
            <Route path="/historico" element={<PaginaHistorico />} />
            <Route path="/transporte" element={<PaginaTablero />} />
            <Route path="/presupuesto" element={<PaginaTablero />} />
            <Route path="/parametros" element={<PaginaTablero />} />
            <Route path="/herramientas" element={<PanelHerramientas />} />
            <Route path="/checklist" element={<PaginaTablero />} />
            <Route path="/novedades" element={<PaginaTablero />} />
            {/* Abordaje: conductor verifica / estudiante ve su código */}
            <Route path="/abordaje/:salidaId" element={<PaginaVerificacionAbordaje />} />
            <Route path="/mi-codigo/:salidaId" element={<PaginaCodigoEstudiante />} />

            {/* Otros (placeholders actuales) */}
            <Route path="/mi-codigo" element={<PaginaTablero />} />
            <Route path="/documentos" element={<PaginaTablero />} />
            <Route path="/perfil" element={<PaginaTablero />} />

            {/* Redirige raíz → tablero */}
            <Route index element={<Navigate to="/tablero" replace />} />
            <Route path="*" element={<Navigate to="/tablero" replace />} />

          </Route>
        </Route>

      </Routes>
    </>
  );
}
