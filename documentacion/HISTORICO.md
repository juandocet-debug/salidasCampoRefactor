# Resumen de Refactorización y Avances (Sesión Actual)

## 1. Clean Code en Frontend (Componentes Menores a 200 Líneas)
- **`ModalAgregarParada.jsx` -> `PantallaParada.jsx` (Rediseño Premium)**
  - Reemplazamos el antiguo modal emergente por un componente inyectado en pantalla completa que sigue los colores institucionales y una UI en 2 columnas.
  - Se modularizó en submódulos para no superar las 200 líneas: `<SugerenciasMunicipios />`, `<ProgramacionItinerario />`, `<MotivoYDuracion />`, extrayendo la lógica visual pesada.
  - Se crearon utilidades separadas (`PantallaParadaHelpers.js`, `PantallaParadaIconos.jsx`).
- **`Paso3Logistica` y Kanban**
  - Implementación de Scroll Horizontal y drag-and-drop en la vista de tarjetas.
  - Remoción de importaciones innecesarias, compactación de lógica `onDrag`, `onDrop`.
- **Buscador Inteligente de Logística**
  - Modularizamos la petición múltiple (Google, Overpass, Nominatim) extrayéndola de los componentes visuales a helpers de estado puramente asíncronos (`buscarEnRutaApis.js`).

## 2. Refactor Arquitectónico de Base de Datos / Backend (BFF)
- Detectamos que la base de datos está organizada por "Dominio" (`salidas`, `transporte`, `usuarios`), mientras que el Frontend se piensa por "Roles" (`profesor`, `coordinador`).
- **Backend For Frontend (BFF)**: Se inició el estándar de arquitectura BFF. 
  - Se creó la carpeta `backend/api/profesor/`.
  - Se crearon endpoints limpios expuestos en `/api/profesor/salidas/` únicamente con métodos, serializers y decoradores `@permission_classes([EsProfesor])` válidos solo para dicho rol.
  - Esto se hizo conservando todos los Modelos en la carpeta de dominio de la DB (`aplicaciones/salidas/modelos.py`), de forma que **no alteramos la integridad de la base de datos**.

## 3. Pruebas Automáticas Exitosas
- Se probó el ciclo de vida de la API refactorizada mediante interacción de UI, confirmando:
  - Creación de borradores.
  - Edición y persistencia de Salidas (Paso 1 y Paso 2).
  - Carga de puntos en el mapa desde el tablero de Profesor (Paso 3).

## Próximos pasos (Mañana)
- Extender el modelo BFF a `/api/coordinador/` y `/api/conductor/`.
- Limpiar vistas web antiguas.
- Seguir reduciendo el tamaño de archivos pesados en frontend que resten para asegurar menos de 200 líneas de código y limpieza técnica estricta.

## 4. Gestión de Flota e Integración IA (Sprint Actual)
- **Refactorización del Modelo de Permisos (`EsGestorFlota`)**
  - Se unificó el acceso administrativo para la gestión de vehículos. Ahora `admin_sistema`, `coordinador_salidas`, `coordinador_academico` y usuarios con `is_staff`/`is_superuser` pueden crear, editar y eliminar vehículos, resolviendo el error 403.
- **Asistente IA para Vehículos**
  - Afinación del prompt de ChatGPT/Groq para predecir con mayor precisión el `tipo` (Bus, Buseta, Microbús, Camioneta) y la `capacidad` de pasajeros.
  - Corrección de la fórmula de rendimiento. La IA generaba km/litro, se impuso validación estricta para entregar siempre **km/galón** basándose en métricas colombianas estandarizadas.
- **Soporte Dinámico de Medios (Imágenes de Flota)**
  - Activación nativa de `MEDIA_URL` y `MEDIA_ROOT` en Django para servir imágenes cargadas por el usuario en tiempo real sin requerir reconstrucción del frontend. Se migró la carpeta `vehiculos/` a `media/vehiculos/`.
- **Dashboard de Flota (UI Premium 2 Columnas)**
  - Reestructuración profunda de `PanelHerramientas.jsx` y `TabFlota.jsx` adoptando un patrón de diseño "Bento Box / Split Dashboard".
  - Se eliminó la pestaña huérfana "Parámetros", integrando la configuración económica ("Costos Generales") como una columna lateral (`sticky sidebar`) directamente en el módulo de Flota.
  - El módulo Flota se estableció como la pestaña predeterminada ("landing page") del Administrador, priorizando el control logístico.
  - Optimización de actualizaciones locales en React: Los cambios en vehículos (ej. vía IA o edición manual) ahora actualizan el estado instantáneamente sin re-fetchear toda la base de datos (Optimistic UI fallback).
