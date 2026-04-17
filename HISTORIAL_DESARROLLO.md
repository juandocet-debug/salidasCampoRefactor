# Historial de Desarrollo - OTIUM (Salidas de Campo)

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
