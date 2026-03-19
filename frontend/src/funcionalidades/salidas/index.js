// src/funcionalidades/salidas/index.js
// ──────────────────────────────────────────────────────────────────────────
// BARREL del slice Salidas
//
// Este es el punto de entrada público del slice.
// El resto de la aplicación solo importa desde aquí — nunca
// entra directamente a las subcarpetas internas.
//
// Correcto:   import { useSalidas } from 'funcionalidades/salidas'
// Incorrecto: import { useSalidas } from 'funcionalidades/salidas/estado/useSalidas'
// ──────────────────────────────────────────────────────────────────────────

// Estado
export { useSalidas } from './estado/useSalidas';

// API (para casos donde se necesita llamada directa puntual)
export {
  listarMisSalidas,
  obtenerSalida,
  crearSalida,
  actualizarSalida,
  enviarSolicitud,
  cancelarSalida,
} from './api/salidaApi';
