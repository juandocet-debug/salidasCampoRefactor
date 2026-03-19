# Wireframes FOR-DOC-008 - Sistema de Salidas de Campo

Sistema de wireframes completo para la gestión de salidas académicas de campo según el formato FOR-DOC-008.

## 📋 Contenido

Este proyecto incluye wireframes HTML/CSS para todas las secciones del sistema:

### Páginas Principales

- **index.html** - Dashboard principal con lista de salidas y estadísticas

### Secciones del Formulario (A-H)

- **seccion-a-informacion-general.html** - Información básica de la salida
- **seccion-b-justificacion.html** - Justificación académica
- **seccion-c-objetivos.html** - Objetivos generales y específicos
- **seccion-d-competencias.html** - Competencias y resultados de aprendizaje
- **seccion-e-metodologia.html** - Metodología de trabajo en campo
- **seccion-f-programacion.html** - Programación de ruta tipo Uber con mapas
- **seccion-g-actividades.html** - Actividades académicas en campo
- **seccion-h-evaluacion.html** - Criterios de evaluación

### Secciones Post-Ejecución (I-K)

- **seccion-i-evaluacion-post.html** - Evaluación final después de la salida
- **seccion-j-tiempos-reales.html** - Registro de tiempos reales vs planificados
- **seccion-k-cierre.html** - Cierre académico del formato

## 🎨 Estilo Visual

El diseño sigue un **estilo minimalista editorial** con las siguientes características:

### Paleta de Colores

- Blanco roto: `#F7F7F5`
- Grises cálidos: `#D8D8D6`, `#CFCFCB`, `#BDBDBD`
- Carbón oscuro: `#1F1F1F`, `#2A2A2A`
- Negro suave: `#111111`, `#1A1A1A`

### Tipografía

- Familia: Inter, SF Pro, Helvetica Now (sans-serif)
- Pesos: Regular (400), Medium (500), Semibold (600), Bold (700)
- Interlineado amplio: 1.6-1.7 para legibilidad

### Características

- Mucho espacio en blanco (white space)
- Cards limpias con bordes sutiles
- Botones pill-shaped minimalistas
- Iconos outline simples
- Responsive para desktop, tablet y mobile

## 🚀 Cómo Usar

1. **Abrir el proyecto**
   ```
   Abrir index.html en un navegador web
   ```

2. **Navegación**
   - El dashboard (index.html) muestra todas las salidas
   - Click en cualquier tarjeta para ver el formulario completo
   - Use el sidebar izquierdo para navegar entre secciones

3. **Estructura de archivos**
   ```
   wireframe/
   ├── index.html
   ├── seccion-a-informacion-general.html
   ├── seccion-b-justificacion.html
   ├── ... (todas las secciones)
   ├── css/
   │   ├── design-system.css
   │   └── sidebar.css
   └── README.md
   ```

## 📱 Responsive

El sistema incluye breakpoints responsivos:

- **Desktop**: > 1024px (diseño completo con sidebar)
- **Tablet**: 768px - 1024px (ajustado)
- **Mobile**: < 768px (sidebar colapsable, diseño vertical)

## 🔑 Características Principales

### Dashboard

- Estadísticas de salidas (total, borradores, aprobadas, cerradas)
- Lista de salidas con estados y progreso
- Filtros por estado
- Búsqueda de salidas
- Paginación

### Formulario

- **Navegación con sidebar persistente**
- Progreso visual (barra de completitud)
- Campos obligatorios vs opcionales claramente marcados
- Validaciones visuales
- Guardado de borradores
- Navegación secuencial entre secciones

### Sección F - Programación Tipo Uber

- Placeholder para mapa interactivo (Google Maps API)
- Cálculo automático de distancia y tiempo
- Sub-tramos pedagógicos opcionales
- Paradas programadas (descanso, alimentación, técnicas)
- Vista de ruta visual

### Post-Ejecución

- Evaluación de cumplimiento de objetivos
- Registro automático de tiempos reales
- Comparación planificado vs real
- Impacto pedagógico de retrasos
- Cierre académico con confirmación

## 🛠 Siguiente Paso: Implementación

Para convertir estos wireframes en una aplicación funcional:

1. **Backend**
   - API REST con Node.js/Express o Django
   - Base de datos PostgreSQL o MongoDB
   - Autenticación y autorización

2. **Frontend**
   - React, Vue o Angular para interactividad
   - Integración con Google Maps API
   - Sistema de validación de formularios
   - Gestión de estados (Redux, Vuex, etc.)

3. **Integraciones**
   - Sistema de transporte (tipo Uber) para tracking
   - Notificaciones por email
   - Generación de PDFs
   - Sistema de aprobaciones workflow

## 📝 Notas Técnicas

- Los wireframes son estáticos (HTML/CSS puro)
- No incluyen JavaScript funcional (solo placeholders)
- Diseñados para demostración y validación de UX
- Listos para handoff a desarrollo

## ✨ Créditos

Diseñado con estilo **minimalista editorial** inspirado en:
- Revistas de viajes premium
- Medium / Notion
- Airbnb
- Estética travel/lifestyle

---

**Versión**: 1.0
**Fecha**: Febrero 2026
**Stakeholder**: Profesor (Coordinador de Salidas)
