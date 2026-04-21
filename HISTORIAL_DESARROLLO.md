# Historial de Desarrollo - OTIUM (Salidas de Campo)

## [21 de Abril de 2026] - Reestructuración UX/UI del Perfil Logístico y Consejo

### 🎯 Logros Principales
- **Reestructuración de UI Logística (UX Premium):** Transformación total del Dashboard Logístico. Se reemplazaron tablas con datos genéricos / emojis por un sistema de Listado Acordeón estandarizado. Al hacer clic, despliega un sub-panel grid altamente pulido y 100% enfocado en transporte.
- **Micro-Segmentación de Roles (Frontend):** Se limpió el ruido visual (Justificaciones y Objetivos Pedagógicos) en la vista Logística para mostrar solo "Resumen Estratégico", "Manifiesto de Pasajeros" e "Itinerario Técnico" (Km, Tiempos, Costos y Viáticos). 
- **Integración de Capas (Dominio - ORM):** Alteración directa sobre el `ValueObjectsLogistica.py` (DTO) y el Repositorio de BD del backend (Arquitectura Hexagonal). Ahora el equipo de transporte recibe por fin datos calculados reales (Horas exactas de salida/llegada, desagregación de Estudiantes vs Docentes y proyección de costo real de viáticos sincronizando con `costoUtils.js`).
- **Vista de Consejo:** Finalización del despliegue en cascada del Consejo de Facultad para la lectura expedita de los radicados pedagógicos en curso.

### 🛠️ Retos Encontrados
- **Disidencia de DTOs BD a UI:** Se notó que los ValueObjects de la capa Logística no contenían detalles críticos de pasajeros ni fechas formales, sino la identificación básica del viaje. Se logró permear la estructura originada en Core hasta el Repositorio sin romper los contratos del flujo Hexagonal.
- **Aproximación de Viáticos Nativos:** Se descubrió que la plataforma estimaba viáticos dinámicamente en UI basado en la duración de días pero no lo persistía aislado. Se resolvió extrapolando el algoritmo interno (`min 0.5, duracionDias - 0.5`) hacia el modelo de presentación Py.

### 🚀 Próximos Pasos Proyectados
- **Flujo de Acciones de Asignación Logística:** Habilitar y conectar a DB de transporte los formularios interactivos que empuja el botón "Asignar", seleccionando Empresas o Vehículos Propios.
- **Módulo de Cierre Operativo:** Desarrollar el flujo del conductor/supervisor donde se hace checklist y registro del cuentakilómetros real al regreso de la universidad.

---

## [17 de Abril de 2026] - Refactorización de Dashboard de Coordinación y Endpoints Core

### 🎯 Logros Principales
- **Estabilización de Integración Frontend-Backend**: Se subsanaron múltiples errores de Importación (HTTP 500) en el módulo de Coordinador y Salidas Core tras detectar desajustes en el nombrado de los modelos (`UsuariosModel` a `UsuarioModel`).
- **Dashboard de Coordinador Sincronizado**: Las vistas críticas del coordinador fueron despojadas de sus datos estáticos ("hardcodeados"). El presupuesto, las duraciones de viaje, costos reales y nombre de los puntos enrutados extraen información fehaciente del motor de mapas y el controlador central.
- **Flujo Lógico Cíclico Inquebrantable**: Reparación de la "Bandeja de Entrada" de revisiones del Coordinador. Cualquier salida con dictamen (Ej: "Aprobada", "Favorable con Ajustes", etc.) desaparece automáticamente de las pendientes, mejorando notablemente el workflow colaborativo.
- **Micro-interacciones y UI Premium**: Refinamiento estético general de modales informativos de Paradas en formato lectura, inyección de iconos SVG orgánicos (evitando emojis) y arreglo en superposiciones problemáticas del menú (Barra Lateral activa del "Consejo").
- **Mapeo Inteligente del Itinerario**: Se corrigió el conflicto topológico que dejaba en blanco el Punto Inicial y Final al inspeccionar detalles del viaje en el Dashboard producto del cascarón vacío de los tableros Kanban.

### 🛠️ Retos Encontrados
- **Estados Dinámicos del Mapa**: Interpretar arreglos crudos y arreglos de uso exclusivo UI (los usados por el componente `KanbanItinerario`) indujo un reto de trazabilidad al intentar renderizar en paralelo tableros, vistas previas estáticas y menús dinámicos. Requirió trazar de vuelta hasta el origen puro del array de rutas.
- **Conflictos Estructurales de CSS**: Un menú redundante apuntando a exactamente la misma ruta (`/tablero`) en el rol "Consejo" corrompió las curvas de estado activo del diseño de pseudo-elementos laterales, un reto que requirió pericia CSS para desenmarañar y limpiar adecuadamente.

### 🚀 Próximos Pasos Proyectados
- **QA Flujo Profesor**: Verificar el circuito de edición para las salidas marcadas por el coordinador "Con Ajustes".
- **Dashboard Consejo de Facultad**: Completar el circuito técnico del "Consejo de Facultad" garantizando métricas verídicas.
- **Micro-servicios**: Refactorización progresiva y estandarización de diccionarios de Catálogos (Facultades, Programas).
