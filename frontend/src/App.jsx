// src/App.jsx
// ─────────────────────────────────────────────────────────────────
// ENRUTADOR RAÍZ — Define todas las rutas de la aplicación.
// Rutas públicas: /login
// Rutas protegidas: todo lo demás (bajo Layout)
// ─────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from 'react-router-dom';
import useAutenticacion from '@/shared/hooks/useAutenticacion';
import RutasProtegidas from '@/rutas/RutasProtegidas';
import Layout from '@/shared/componentes/Layout/Layout';
import GlobalAlerts from '@/shared/componentes/Alertas/GlobalAlerts';

// ── Importación directa de módulos ────────────────────
import PaginaLogin from '@/features/auth/presentacion/paginas/Login/PaginaLogin';
import PaginaTablero from '@/features/tablero/presentacion/paginas/PaginaTablero/PaginaTablero';
import PaginaHistorico from '@/features/salidas/presentacion/paginas/Historico/PaginaHistorico';
import PaginaNuevaSalida from '@/features/salidas/presentacion/paginas/NuevaSalida/PaginaNuevaSalida';
import PanelHerramientas from '@/features/admin_sistema/presentacion/paginas/PanelHerramientas/PanelHerramientas';
import PaginaVerificacionAbordaje from '@/features/abordaje/presentacion/paginas/PaginaVerificacionAbordaje/PaginaVerificacionAbordaje';
import PaginaCodigoEstudiante from '@/features/abordaje/presentacion/paginas/PaginaCodigoEstudiante/PaginaCodigoEstudiante';
import PaginaConstruccion from '@/shared/componentes/PaginaConstruccion/PaginaConstruccion';

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
            <Route path="/salidas" element={<PaginaConstruccion />} />
            <Route path="/nueva-salida" element={<PaginaNuevaSalida />} />
            <Route path="/revisiones" element={<PaginaConstruccion />} />
            <Route path="/decisiones" element={<PaginaConstruccion />} />
            <Route path="/historial" element={<PaginaConstruccion />} />
            <Route path="/historico" element={<PaginaHistorico />} />
            <Route path="/transporte" element={<PaginaConstruccion />} />
            <Route path="/presupuesto" element={<PaginaConstruccion />} />
            <Route path="/parametros" element={<PaginaConstruccion />} />
            <Route path="/herramientas" element={<PanelHerramientas />} />
            <Route path="/checklist" element={<PaginaConstruccion />} />
            <Route path="/novedades" element={<PaginaConstruccion />} />
            {/* Abordaje: conductor verifica / estudiante ve su código */}
            <Route path="/abordaje/:salidaId" element={<PaginaVerificacionAbordaje />} />
            <Route path="/mi-codigo/:salidaId" element={<PaginaCodigoEstudiante />} />

            {/* Otros (placeholders actuales) */}
            <Route path="/mi-codigo" element={<PaginaConstruccion />} />
            <Route path="/documentos" element={<PaginaConstruccion />} />
            <Route path="/perfil" element={<PaginaConstruccion />} />

            {/* Redirige raíz → tablero */}
            <Route index element={<Navigate to="/tablero" replace />} />
            <Route path="*" element={<Navigate to="/tablero" replace />} />

          </Route>
        </Route>

      </Routes>
    </>
  );
}
