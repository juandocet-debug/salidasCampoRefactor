# Historial de Desarrollo - OTIUM (Salidas de Campo)

## [22 de Abril de 2026] - Persistencia Logística y CRUD de Asignación de Transporte

### 🎯 Logros Principales

- **Persistencia real de asignaciones logísticas:** Se identificó y corrigió el bug crítico donde `guardar_asignacion_vehiculo` en `DjangoLogisticaRepository.py` solo ejecutaba un `print()` sin escribir nada en base de datos. Ahora persiste correctamente en el modelo `AsignacionExternaLogistica` usando `update_or_create`, garantizando que empresa, conductor y costo queden registrados.

- **Visibilidad completa de salidas asignadas:** Se actualizó `obtener_salidas_por_estado` para retornar salidas en estado `lista_ejecucion` (además de `aprobada_consejo_facultad`), inyectando los datos de asignación (`empresa_asignada`, `conductor_asignado`) desde la tabla `AsignacionExternaLogistica` al DTO de respuesta.

- **ValueObjects extendidos:** Se añadieron los campos `empresa_asignada: Optional[str]` y `conductor_asignado: Optional[str]` al dataclass `AsignacionLogisticaResumen` y se exponen en su `to_dict()`.

- **Dashboard Logístico — Indicadores de estado:** La tabla `ListaAprobadas` ahora muestra una columna **Estado** con badge verde ✓ "Asignado" o amarillo "Pendiente". Los KPIs cambiaron a "Por Asignar" y "Transporte Asignado". Las filas de salidas asignadas tienen fondo verde.

- **Botón contextual Reasignar/Asignar:** El botón de acción cambia dinámicamente: verde "Reasignar" para salidas ya gestionadas, azul "Asignar" para pendientes. El panel de asignación muestra un **banner verde** con empresa/conductor/costo cuando la salida ya tiene transporte asignado.

- **CRUD de asignación — Borrar:** Se implementó endpoint `DELETE /api/salidas/logistica/asignar/?salida_id=X` que elimina el registro `AsignacionExternaLogistica` y revierte el estado a `aprobada_consejo_facultad`. Incluye botón "Borrar asignación" con modal de confirmación en el panel de asignación.

- **CRUD de asignación — Editar con pre-relleno:** Al abrir una salida ya asignada en modo "Reasignar", el panel auto-detecta el tipo de transporte (propio vs contratado), carga las listas de empresas/conductores y ejecuta auto-match por `razon_social`/`nombre` para pre-rellenar correctamente los comboboxes con IDs válidos. La placa se extrae automáticamente del formato `"Empresa (Placa: ABC-123)"`.

- **Refresco forzado del listado:** El `CoordinadorLogisticaDashboard` usa un `refreshKey` que se incrementa al volver del panel de asignación, garantizando que `ListaAprobadas` remonte y recargue datos frescos desde la API en todo momento.

### 🛠️ Retos Encontrados

- **DRF no parsea body en DELETE:** El endpoint `DELETE` no podía leer `salida_id` del body porque Django REST Framework no procesa el cuerpo en métodos DELETE de forma confiable. Solución: pasar el parámetro como query string (`?salida_id=X`).
- **Import faltante en controller:** `EstadoOperativoSalida` no estaba importado en `CoordinadorLogisticaController`, causando un `NameError` silencioso que devolvía 400. Se corrigió con import al nivel del módulo.
- **Caché parcial de Vite HMR:** Vite aplicaba el `console.log` actualizado (hot reload de función) pero no recompilaba el template JSX. Solución: reinicio completo del servidor Vite (`npm run dev`) + hard refresh del browser.
- **Mismatch texto vs ID en comboboxes:** El pre-relleno inicial de `formDataContratado` usaba strings (nombres de empresa/conductor) en campos que esperan IDs numéricos. Se separó la inicialización en vacío y se delegó el llenado a `useEffect` de auto-match que corre después de que cargan las listas.

### 🚀 Próximos Pasos Proyectados
- **Módulo de Monitoreo en Ejecución:** Conectar el panel de novedades operativas con datos reales de salidas en `lista_ejecucion`.
- **Módulo de Cierre Operativo:** Completar el flujo de checklist del conductor al regreso (km final, limpieza, llantas, luces).
- **Validación de datos "reales" de empresa:** Asegurar que el catálogo de `EmpresaTransporte` y `ConductorExterno` esté poblado con datos institucionales reales antes de pruebas con usuarios finales.

### 📌 Pendiente para el 23 de Abril de 2026

#### 🔴 Prioritario
1. **Limpiar logs de diagnóstico:** Eliminar los `print()` de depuración en `DjangoLogisticaRepository.obtener_salidas_por_estado` y el `console.log('[DEBUG]...')` en `ListaAprobadas.jsx` que se agregaron para diagnosticar el problema de caché de Vite. No deben ir a producción.

2. **Verificar flujo completo de edición de asignación:** Confirmar que el auto-match de empresa y conductor funciona correctamente en el formulario de "Reasignar" con datos reales del catálogo (no datos de prueba como "GJGJH"). El flujo es: abrir "Reasignar" → tipo auto-seleccionado → empresas cargadas → empresa pre-seleccionada por `razon_social` → conductores cargados → conductor pre-seleccionado por `nombre`.

3. **Probar el DELETE de asignación end-to-end:** Verificar que al dar "Borrar asignación" → confirmar → la salida vuelve al estado "Pendiente" en el listado y se puede reasignar desde cero.

#### 🟡 Importante
4. **Panel de Monitoreo en Ejecución (`MonitoreoEjecucionPanel`):** Actualmente muestra datos estáticos. Conectar con el endpoint de salidas en `lista_ejecucion` para mostrar las salidas activas con sus datos de asignación (empresa, conductor, fechas).

5. **Panel de Cierres Operativos (`CierresOperativosPanel`):** Implementar el formulario de cierre con campos: km final, checklist (limpieza, llantas, luces) y observaciones. El endpoint backend `POST /api/salidas/logistica/cierres/` ya existe — solo falta la UI.

#### 🟢 Mejoras
6. **Poblar catálogo de logística:** Registrar al menos 2-3 empresas de transporte y conductores reales en `EmpresaTransporte` y `ConductorExterno` para validar el flujo completo de asignación contratada con datos institucionales.

7. **Validar flujo con salida nueva:** Crear una nueva salida desde el rol Profesor, pasar por Coordinación → Consejo → Aprobación → Asignación Logística end-to-end para confirmar que no haya estados rotos en el pipeline completo.

---

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
