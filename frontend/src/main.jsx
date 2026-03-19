// src/main.jsx
// Punto de entrada de React — monta la app con BrowserRouter
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './nucleo/sistema-diseno/variables.css';
import App from './App.jsx';

// Inyección de dependencias para el cliente HTTP
import { configurarAdaptadorHttp } from './nucleo/api/clienteHttp';
import useAutenticacion from './modulos/autenticacion/estado/useAutenticacion';

configurarAdaptadorHttp(
  () => useAutenticacion.getState().token,
  () => useAutenticacion.getState().cerrarSesion()
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
