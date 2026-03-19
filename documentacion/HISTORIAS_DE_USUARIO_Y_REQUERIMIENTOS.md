# OTIUM — SISTEMA DE GESTIÓN DE SALIDAS DE CAMPO
## Historias de Usuario y Requerimientos Funcionales
**Versión 1.1** | Fecha: 2026-03-04
> 37 Historias de Usuario · 19 Grupos RF · 10 RNF · 3 Flujos de Negocio · 6 Roles

---

## 1. DESCRIPCIÓN GENERAL DEL SISTEMA

OTIUM es una plataforma web para la gestión integral del ciclo de vida de las salidas académicas de campo en una institución universitaria (UPN). Cubre desde la solicitud pedagógica del profesor, la revisión del coordinador académico, la aprobación del consejo de facultad, la gestión operativa y logística, hasta el monitoreo en tiempo real y el cierre operativo.

### Módulo de Costos (v1.1)

El sistema incorpora un motor de cálculo de costos estimados basado en la fórmula:

```
C_total = (DT/R · Pg) + (max(0.5, D − 0.5) · C_noche) + (max(0, Ht − 9D) · C_hora)
```

| Variable | Descripción | Configurado por |
|----------|-------------|-----------------|
| DT | Distancia Total del recorrido (km) | Itinerario del Profesor |
| R | Rendimiento del vehículo (km/galón) | Coordinador de Salidas |
| Pg | Precio del galón de combustible (COP) | Coordinador de Salidas |
| D | Duración de la salida (días) | Profesor (fechas) |
| Ht | Horas totales del viaje | Profesor (itinerario) |
| C_noche | Costo por noche de hospedaje (COP) | Coordinador de Salidas |
| C_hora | Valor hora extra del conductor (COP) | Coordinador de Salidas |

---

## 2. ROLES DEL SISTEMA

| ROL ID | ROL | DESCRIPCIÓN |
|--------|-----|-------------|
| ROL-01 | Profesor | Solicita salidas, gestiona FOR-DOC-008, monitorea ejecución. |
| ROL-02 | Coordinador Académico | Revisa pedagógicamente las solicitudes, emite concepto. |
| ROL-03 | Consejo de Facultad | Aprueba, solicita cambios o rechaza solicitudes. |
| ROL-04 | Coordinador de Salidas | Gestiona operación, configura parámetros de costos, monitorea. |
| ROL-05 | Conductor | Recibe asignaciones, checklist, novedades, abordaje. |
| ROL-06 | Estudiante | Registro QR, documentos, código de verificación. |

---

## 3. HISTORIAS DE USUARIO

### 3.1 Módulo Profesor

**HU-PROF-001 — Dashboard de Salidas**
COMO profesor QUIERO ver un panel con todas mis solicitudes PARA tener visión general del estado de cada una.
- Tarjetas con: nombre, asignatura, fecha, estado.
- Estados: Borrador, Enviada, En Revisión, Aprobada, Rechazada, En Ejecución.
- Filtros por estado, distancia, precio, cantidad estudiantes. Barra de búsqueda.
- Botón "Nueva Solicitud". Estadísticas de resumen.

**HU-PROF-002 — Crear Solicitud – Paso 1: Información General**
COMO profesor QUIERO completar la información básica PARA iniciar el proceso (FOR-DOC-008).
- Campos: nombre, asignatura, semestre, programa, estudiantes, justificación.
- Stepper horizontal (1 de 4). Botones: Cancelar, Guardar Borrador, Siguiente.

**HU-PROF-003 — Crear Solicitud – Paso 2: Planeación Pedagógica**
COMO profesor QUIERO definir objetivos, competencias y metodología PARA justificar la salida.
- Campos: objetivos generales, objetivos específicos, competencias, metodología.
- Agregar múltiples objetivos. Botones: Anterior, Guardar Borrador, Siguiente.

**HU-PROF-004 — Crear Solicitud – Paso 3: Logística**
COMO profesor QUIERO definir la ruta e itinerario PARA planificar la ejecución.
- Constructor visual de ruta. Campos por punto: lugar, hora, actividad.
- Campo Duración D (días) y Horas Totales Ht — usados para el estimado de costo.
- Tarjeta resumen negra muestra: Total Distancia, Tiempo Est., Costo Estimado (calculado automáticamente con parámetros del coordinador).
- Agrega paradas. Modal de actividades. Tipo de transporte.

**HU-PROF-005 — Crear Solicitud – Paso 4: Evaluación**
COMO profesor QUIERO definir criterios de evaluación PARA medir el aprendizaje.
- Criterios con porcentajes. Resumen completo. Badges: vehículo, ruta, conductor.
- Al enviar: estado → "Enviada", notifica al coordinador.

**HU-PROF-006 — Ver Historial de Solicitudes**
COMO profesor QUIERO acceder al historial de mis solicitudes PARA consultar solicitudes pasadas.

**HU-PROF-007 — Gestión de Plantillas**
COMO profesor QUIERO guardar y reutilizar formularios como plantillas PARA agilizar solicitudes recurrentes.

**HU-PROF-008 — Dashboard de Viaje en Ejecución**
COMO profesor QUIERO ver el estado en tiempo real de la salida PARA monitorear el progreso.
- Estados: En Punto de Encuentro, En Ruta, En Destino, Retorno, Finalizado.
- Tracker visual. Acciones rápidas: QR Estudiantes, Verificar Código.

**HU-PROF-009 — Lista de Control de Abordaje (Profesor)**
COMO profesor QUIERO ver la lista de estudiantes y su estado PARA saber quiénes abordaron.
- Tabla: foto, nombre, ID, programa, estado. Barra de progreso.
- Filtros. Búsqueda. Pendientes resaltados en amarillo.

**HU-PROF-010 — Verificar Código de Estudiante**
COMO profesor QUIERO ingresar el código de verificación PARA confirmar identidad y registrar abordaje.
- Modal con campo de 6 caracteres. Muestra foto, nombre e ID. Botón confirmar.

---

### 3.2 Módulo Coordinador Académico

**HU-COORD-001 — Dashboard de Revisiones Pendientes**
COMO coordinador académico QUIERO ver las solicitudes pendientes PARA priorizar mi trabajo.
- Tabla: código, nombre, profesor, facultad, fecha, estado, acciones.
- Stats: total pendientes, revisadas, promedio de tiempo.

**HU-COORD-002 — Revisión Pedagógica de Solicitud**
COMO coordinador académico QUIERO evaluar criterios pedagógicos PARA emitir concepto formal.
- Vista dos columnas. Por criterio: CUMPLE / NO CUMPLE. Observaciones.
- Decisión: FAVORABLE / FAVORABLE CON AJUSTES / NO FAVORABLE.

**HU-COORD-003 — Historial de Revisiones**
COMO coordinador académico QUIERO el historial de mis revisiones PARA tener trazabilidad.

**HU-COORD-004 — Ver Salidas Aprobadas**
COMO coordinador académico QUIERO ver las salidas aprobadas PARA dar seguimiento.

---

### 3.3 Módulo Consejo de Facultad

**HU-CONS-001 — Dashboard de Decisiones Pendientes**
COMO miembro del Consejo QUIERO ver las solicitudes que requieren decisión PARA gestionar la agenda.
- Stats: pendientes, aprobadas, con observaciones, rechazadas.

**HU-CONS-002 — Detalle y Decisión de Solicitud**
COMO miembro del Consejo QUIERO revisar y decidir PARA aprobar, solicitar cambios o rechazar.
- Semáforo visual. Timeline. Opciones: APROBAR / SOLICITAR CAMBIOS / RECHAZAR.
- Si SOLICITAR CAMBIOS: campo Tiempo de Ajuste (días).

**HU-CONS-003 — Actas y Reportes**
COMO miembro del Consejo QUIERO acceder a actas de decisiones pasadas PARA mantener registro institucional.

---

### 3.4 Módulo Coordinador de Salidas

**HU-CSAL-001 — Dashboard Operativo**
COMO coordinador QUIERO un panel de estadísticas operativas PARA visión global de la carga.
- Cards: aprobadas, en preparación, en ejecución, finalizadas. Módulos de acceso rápido.

**HU-CSAL-002 — Gestión de Salidas Aprobadas**
COMO coordinador QUIERO ver la lista de salidas aprobadas PARA planificar la logística.
- Tabla con filtros, estados, badges de categoría, alertas de cupo, acciones por fila.

**HU-CSAL-003 — Asignar Transporte**
COMO coordinador QUIERO asignar vehículos y conductores PARA garantizar la logística.
- Wizard 3 pasos: Tipo → Vehículo → Conductor.
- Validación de capacidad. Resumen antes de confirmar.

**HU-CSAL-004 — Presupuesto Operativo**
COMO coordinador QUIERO gestionar el presupuesto PARA controlar costos operativos.
- Dashboard con cards: asignado, ejecutado, disponible, comprometido.
- Barras de progreso con colores de alerta. Desglose por categoría.

**HU-CSAL-005 — Monitoreo en Ejecución**
COMO coordinador QUIERO monitorear en tiempo real las salidas en curso PARA intervenir ante novedades.
- Timeline de hitos. Itinerario con horarios reales vs. planificados. Registro de novedades.

**HU-CSAL-006 — Lista de Control de Abordaje (Coordinador)**
COMO coordinador QUIERO ver el estado de abordaje PARA supervisar que todos estén a bordo.
- Columna "Verificado por": badge Conductor (negro) / Profesor (azul).
- Botones: Notificar Conductor, Notificar Profesor.

**HU-CSAL-007 — Cancelar / Reprogramar Salida**
COMO coordinador QUIERO registrar cancelación o reprogramación PARA notificar a todos.
- Tipos: Reprogramar fecha, Cambio de ruta, Cancelación total.
- Calendario de disponibilidad. Previsualización de notificación.

**HU-CSAL-008 — Cierre Operativo**
COMO coordinador QUIERO realizar el cierre formal PARA documentar resultados.
- Checklist de cierre. Comparativo costos ejecutados vs. presupuestados. Cierre definitivo.

**HU-CSAL-009 — Reportes Logísticos**
COMO coordinador QUIERO generar reportes consolidados PARA rendir cuentas.
- Catálogo: Presupuestal, Flota, Indicadores, Novedades. Exportación a PDF/Excel.

**HU-CSAL-010 — Configurar Parámetros del Sistema** *(Nuevo v1.1)*
COMO coordinador QUIERO configurar las tarifas globales PARA que el cálculo de costos refleje precios reales.
- Panel plegable en Presupuesto Operativo con campos: Pg, R, C_noche, C_hora.
- Persiste en localStorage (clave: `otium_params`). Badge "✓ Guardado".
- Defaults del sistema: Pg=16500, R=8, C_noche=222000, C_hora=11000.
- Muestra la fórmula aplicada explícitamente.
- Restaurar Defaults disponible.

---

### 3.5 Módulo Conductor

**HU-COND-001 — Dashboard de Mis Viajes**
COMO conductor QUIERO ver la lista de viajes asignados PARA planificar mis actividades.
- Cards con: código, destino, fecha, profesor, pasajeros, estado, vehículo.

**HU-COND-002 — Detalle del Viaje**
COMO conductor QUIERO ver el detalle completo de un viaje PARA conocer toda la información.
- Itinerario con timeline. Acciones de progreso. Modal de verificación de código.

**HU-COND-003 — Checklist del Vehículo**
COMO conductor QUIERO completar la inspección pre-viaje PARA garantizar condiciones seguras.
- Pestañas: Mecánica, Seguridad, Documentos, Confort. Items: OK/NO OK/N/A.
- Firma digital. No se puede iniciar viaje sin 100% completado.

**HU-COND-004 — Registrar Novedad**
COMO conductor QUIERO reportar incidentes PARA dejar registro formal.
- Tipos: Mecánica, Accidente, Clima, Vial, Salud, Otro. Urgencia con colores.
- Captura GPS automática. Evidencia fotográfica.

**HU-COND-005 — Lista de Control de Abordaje (Conductor)**
COMO conductor QUIERO gestionar la lista de estudiantes PARA controlar el abordaje.
- Verificación de código via modal. Confirmación visual: foto + nombre + ID.

**HU-COND-006 — Historial de Viajes**
COMO conductor QUIERO el historial de todos mis viajes PARA revisar mi desempeño.
- Stats: total viajes, km recorridos, este mes. Filtros por mes/estado/ruta.

---

### 3.6 Módulo Estudiante

**HU-EST-001 — Dashboard del Estudiante**
COMO estudiante QUIERO ver mis salidas activas y próximas PARA estar informado.
- Card de escaneo QR. Lista de salidas con estados: Activa, Pendiente docs, Incompleta.
- Barra de progreso de documentos por salida.

**HU-EST-002 — Registro QR a Salida**
COMO estudiante QUIERO escanear QR para unirme a una salida PARA inscribirme digitalmente.
- Pantalla post-escaneo con datos. Botón "Unirme". Aviso de datos personales.

**HU-EST-003 — Detalle de Salida (Vista Estudiante)**
COMO estudiante QUIERO ver el detalle de una salida PARA conocer información y subir documentos.
- Pestañas: Información, Documentos, Estado. Upload de archivos. Timeline.

**HU-EST-004 — Mis Documentos**
COMO estudiante QUIERO gestionar un repositorio de documentos PARA no subirlos en cada salida.
- Tipos: Identidad, EPS/ARL, Consentimiento, Póliza. Estados: Vigente/Vencido/No cargado.
- Auto-adjunción a nuevas salidas.

**HU-EST-005 — Historial de Salidas (Estudiante)**
COMO estudiante QUIERO el historial de todas mis salidas PARA tener registro académico.
- Agrupado por semestre. Por salida: nombre, destino, fecha, profesor, nota.

**HU-EST-006 — Código de Verificación de Abordaje**
COMO estudiante QUIERO generar un código único PARA que confirmen mi identidad al abordar.
- Requiere foto. Código 6 caracteres. Activo solo el día de la salida. Badge ACTIVO/INACTIVO.

---

## 4. REQUERIMIENTOS FUNCIONALES

### RF-001 — Autenticación y Autorización
| ID | Descripción |
|----|-------------|
| RF-001.1 | Inicio de sesión con credenciales (usuario y contraseña). |
| RF-001.2 | 6 roles diferenciados con permisos específicos. |
| RF-001.3 | Sidebar de navegación contextual al rol autenticado. |
| RF-001.4 | Sidebar: logo, perfil (nombre y rol), menú, cerrar sesión. |
| RF-001.5 | Mecanismo de cambio de roles (desarrollo/demo). |

### RF-002 — Solicitud de Salida (FOR-DOC-008)
| ID | Descripción |
|----|-------------|
| RF-002.1 | Wizard de 4 pasos secuenciales con stepper horizontal. |
| RF-002.2 | Paso 1: nombre, asignatura, semestre, programa, estudiantes, justificación. |
| RF-002.3 | Paso 2: objetivos, competencias, metodología. |
| RF-002.4 | Paso 3: constructor de ruta, itinerario, campos D y Ht para cálculo de costo. |
| RF-002.5 | Paso 4: criterios de evaluación con porcentajes, resumen pre-envío con badges. |
| RF-002.6 | Guardar como borrador en cualquier paso. |
| RF-002.7 | Navegación bidireccional entre pasos. |
| RF-002.8 | Al enviar: estado → "Enviada", notificación al coordinador académico. |
| RF-002.9 | Modo edición para borradores o solicitudes devueltas. |

### RF-003 — Revisión Pedagógica
| ID | Descripción |
|----|-------------|
| RF-003.1 | Evaluar criterios con CUMPLE o NO CUMPLE. |
| RF-003.2 | Campo de observaciones por criterio. |
| RF-003.3 | Concepto: FAVORABLE / CON AJUSTES / NO FAVORABLE. |
| RF-003.4 | Timeline de acciones con fecha, hora y usuario. |
| RF-003.5 | Vista por pestañas de la solicitud. |

### RF-004 — Decisión del Consejo
| ID | Descripción |
|----|-------------|
| RF-004.1 | Opciones: APROBAR, SOLICITAR CAMBIOS, RECHAZAR. |
| RF-004.2 | SOLICITAR CAMBIOS requiere Tiempo de Ajuste en días. |
| RF-004.3 | Estado → "pendiente por ajuste" luego "ajustada" al responder el profesor. |
| RF-004.4 | Semáforo visual de decisión. |
| RF-004.5 | Acordeones expandibles para revisar secciones. |

### RF-005 — Gestión de Transporte
| ID | Descripción |
|----|-------------|
| RF-005.1 | Wizard 3 pasos: Tipo → Vehículo → Conductor. |
| RF-005.2 | Selección entre transporte propio y externo. |
| RF-005.3 | Grid de vehículos filtrable por capacidad, tipo y estado. |
| RF-005.4 | Cards de vehículo: placa, tipo, capacidad, estado, disponibilidad, foto. |
| RF-005.5 | Grid de conductores: nombre, licencia, experiencia, calificación, disponibilidad. |
| RF-005.6 | Validación de capacidad: alerta si estudiantes > asientos. |
| RF-005.7 | Formulario de empresa externa si aplica. |
| RF-005.8 | Resumen completo antes de confirmar asignación. |

### RF-006 — Gestión de Presupuesto
| ID | Descripción |
|----|-------------|
| RF-006.1 | Dashboard: total asignado, ejecutado, disponible, comprometido. |
| RF-006.2 | Barras de progreso con advertencia y peligro. |
| RF-006.3 | Desglose por categoría de gasto. |
| RF-006.4 | Registro de gastos individuales. |
| RF-006.5 | Historial de movimientos presupuestales. |

### RF-007 — Monitoreo en Ejecución
| ID | Descripción |
|----|-------------|
| RF-007.1 | Timeline de progreso con hitos actualizados. |
| RF-007.2 | Itinerario con horarios reales vs. planificados. |
| RF-007.3 | Registro y visualización de novedades. |
| RF-007.4 | Modal para agregar novedades. |
| RF-007.5 | Escalar novedades a nivel superior. |
| RF-007.6 | Lista de control de abordaje integrada. |

### RF-008 — Lista de Control de Abordaje
| ID | Descripción |
|----|-------------|
| RF-008.1 | Tabla: foto, nombre, ID, programa, estado. |
| RF-008.2 | Barra de progreso de abordados/total. |
| RF-008.3 | Filtros: Todos, Abordados, Pendientes. |
| RF-008.4 | Búsqueda por nombre o documento. |
| RF-008.5 | Resaltado amarillo de pendientes. |
| RF-008.6 | Vista Conductor: verificación con modal de código. |
| RF-008.7 | Vista Profesor: verificación con modal de código. |
| RF-008.8 | Vista Coordinador: columna "Verificado por" con badge de rol. |
| RF-008.9 | Vista Coordinador: botones notificar conductor/profesor. |
| RF-008.10 | JS independiente por rol: filtrarLista(), filtrarListaProf(), filtrarListaCoord(). |

### RF-009 — Verificación de Abordaje
| ID | Descripción |
|----|-------------|
| RF-009.1 | Estudiante sube foto obligatoria para generar código. |
| RF-009.2 | Código alfanumérico de 6 caracteres único por estudiante-salida. |
| RF-009.3 | Código activo solo en la fecha y hora de la salida. |
| RF-009.4 | Conductor/Profesor ingresan código en modal. |
| RF-009.5 | Sistema muestra foto, nombre e ID para confirmación. |
| RF-009.6 | Al confirmar: estudiante → estado "Abordado". |
| RF-009.7 | Contador de abordados actualizado en tiempo real. |

### RF-010 — Checklist de Vehículo
| ID | Descripción |
|----|-------------|
| RF-010.1 | Categorías: Mecánica, Seguridad, Documentos, Confort. |
| RF-010.2 | Items con estados: OK, NO OK, N/A. |
| RF-010.3 | Campo de observaciones por ítem. |
| RF-010.4 | Evidencia fotográfica por ítem y general. |
| RF-010.5 | Barra de progreso. |
| RF-010.6 | Firma digital del conductor. |
| RF-010.7 | No se puede iniciar viaje sin 100% aprobado. |

### RF-011 — Registro de Novedades
| ID | Descripción |
|----|-------------|
| RF-011.1 | Tipos: Mecánica, Accidente, Clima, Vial, Salud, Otro. |
| RF-011.2 | Urgencia: Baja, Media, Alta, Crítica. |
| RF-011.3 | Descripción en texto libre. |
| RF-011.4 | Adjuntar evidencia fotográfica. |
| RF-011.5 | Captura GPS automática. |
| RF-011.6 | Historial de novedades previas del viaje. |
| RF-011.7 | Estados: Abierta, Resuelta. |

### RF-012 — Cancelación y Reprogramación
| ID | Descripción |
|----|-------------|
| RF-012.1 | Tipos: Reprogramar fecha, Cambio de ruta, Cancelación. |
| RF-012.2 | Calendario de disponibilidad de vehículos y conductores. |
| RF-012.3 | Días bloqueados visibles. |
| RF-012.4 | Selección de nuevo rango de fechas. |
| RF-012.5 | Panel de conductores disponibles. |
| RF-012.6 | Selección de destinatarios de notificación. |
| RF-012.7 | Previsualización del mensaje. |
| RF-012.8 | Motivo obligatorio documentado. |

### RF-013 — Cierre Operativo
| ID | Descripción |
|----|-------------|
| RF-013.1 | Checklist de cierre. |
| RF-013.2 | Novedades resueltas vs. pendientes. |
| RF-013.3 | Comparativo costos ejecutados vs. presupuestados. |
| RF-013.4 | Campo de observaciones finales. |
| RF-013.5 | Cierre definitivo → estado "Cerrada/Histórico". |

### RF-014 — Reportes Logísticos
| ID | Descripción |
|----|-------------|
| RF-014.1 | Catálogo: Presupuestal, Flota, Indicadores, Novedades. |
| RF-014.2 | Filtros por fecha, facultad, tipo de salida. |
| RF-014.3 | Estadísticas de resumen. |
| RF-014.4 | Tabla de detalle. |
| RF-014.5 | Vista previa en modal. |
| RF-014.6 | Exportación a PDF y Excel. |

### RF-015 — Gestión Documental del Estudiante
| ID | Descripción |
|----|-------------|
| RF-015.1 | Repositorio personal de documentos reutilizables. |
| RF-015.2 | Tipos: Identidad, EPS/ARL, Consentimiento, Póliza. |
| RF-015.3 | Estados: Vigente, Vencido, No cargado. |
| RF-015.4 | Adjunción automática a nuevas solicitudes. |
| RF-015.5 | Actualización de documentos vigentes. |

### RF-016 — Registro QR del Estudiante
| ID | Descripción |
|----|-------------|
| RF-016.1 | Escaneo de QR desde la app del estudiante. |
| RF-016.2 | Pantalla de resultado con datos de la salida. |
| RF-016.3 | Verificación de cupos antes de inscribir. |
| RF-016.4 | Consentimiento de tratamiento de datos. |
| RF-016.5 | Redirección a detalle para completar documentación. |

### RF-017 — Navegación y Layout
| ID | Descripción |
|----|-------------|
| RF-017.1 | Sidebar responsivo con hamburguesa en móvil. |
| RF-017.2 | Sidebar: logo, perfil, menú contextual, cerrar sesión. |
| RF-017.3 | Header: botón menú, título, badge de contexto, perfil. |
| RF-017.4 | Layout dos columnas: sidebar fijo + contenido principal. |
| RF-017.5 | Colapsa a una columna en móvil. |

### RF-018 — Parámetros del Sistema *(Nuevo v1.1)*
| ID | Descripción |
|----|-------------|
| RF-018.1 | Coordinador configura 4 variables globales: Pg, R, C_noche, C_hora. Todos sin restricción de valor. |
| RF-018.2 | Parámetros persisten en localStorage con clave `otium_params`. |
| RF-018.3 | Valores por defecto del sistema: Pg=16500, R=8, C_noche=222000, C_hora=11000. |
| RF-018.4 | Botón "Restaurar Defaults" vuelve a los valores originales. |
| RF-018.5 | Parámetros accesibles desde todos los módulos del sistema. |
| RF-018.6 | Panel acordeón plegable con badge "✓ Guardado" al confirmar. |
| RF-018.7 | La fórmula aplicada se muestra explícitamente en el panel. |

### RF-019 — Calculadora de Costo Estimado *(Nuevo v1.1)*
| ID | Descripción |
|----|-------------|
| RF-019.1 | Fórmula: `C_total = (DT/R · Pg) + (max(0.5, D−0.5) · C_noche) + (max(0, Ht−9D) · C_hora)` |
| RF-019.2 | Cálculo en tiempo real al escribir (oninput). |
| RF-019.3 | Resultado desglosado en 3 componentes: Combustible, Hospedaje, Horas Extra. |
| RF-019.4 | Si no hay parámetros configurados: usa defaults + muestra advertencia amarilla. |
| RF-019.5 | Disponible en `presupuesto-operativo.html` con inputs DT, D, Ht. |
| RF-019.6 | En Paso 3 del Profesor: tarjeta resumen negra muestra Costo Estimado al ingresar D y Ht. |
| RF-019.7 | Componente hospedaje aplica mínimo 0.5 noches: max(0.5, D−0.5). |
| RF-019.8 | Horas extra solo cobradas cuando Ht > 9D (jornada estándar 9h/día). |

---

## 5. REQUERIMIENTOS NO FUNCIONALES

| ID | Categoría | Descripción |
|----|-----------|-------------|
| RNF-001 | Responsividad | Responsive en móviles, tablets y escritorio (breakpoints 768px y 1024px). |
| RNF-002 | Diseño Visual | Esquema monocromático (blanco/negro) con acentos mínimos para estados y alertas. |
| RNF-003 | Tipografía | Fuente `font-primary` definida en design-system.css. |
| RNF-004 | Rendimiento | Carga de cada vista < 3 segundos. |
| RNF-005 | Compatibilidad | Chrome, Firefox, Safari y Edge (últimas 2 versiones). |
| RNF-006 | Confirmación | Acciones críticas con diálogo de confirmación (enviar, aprobar, rechazar, cerrar, guardar parámetros). |
| RNF-007 | Seguridad | Información sensible transmitida por HTTPS. |
| RNF-008 | Design System | CSS custom properties en design-system.css, sidebar.css, sidebar-modern.css. |
| RNF-009 | Modularidad JS | Funciones JS independientes por módulo para evitar conflictos. |
| RNF-010 | Consistencia UI | Mismo estilo de cards, tablas, botones, badges y modales en todos los módulos. |

---

## 6. FLUJOS DE NEGOCIO PRINCIPALES

### 6.1 Flujo 1: Ciclo de Vida Completo de una Salida

| PROFESOR | COORD. ACADÉMICO | CONSEJO | COORD. SALIDAS |
|----------|-----------------|---------|----------------|
| Crea solicitud (4 pasos) | Recibe notificación | Recibe solicitud + concepto | Recibe salida APROBADA |
| Paso 3 ve estimado de costo | Revisa pedagógicamente | Decide: APROBAR → APROBADA | Asigna transporte (wizard) |
| Estado: BORRADOR | Evalúa criterios | SOLICITAR CAMBIOS → PEND. AJUSTE | Configura parámetros de costo |
| Envía solicitud | Emite concepto | RECHAZAR → RECHAZADA | Usa calculadora de costos |
| Estado: ENVIADA | Estado: EN REVISIÓN | | Estado LISTA → EJECUCIÓN → CERRADA |

### Subproceso: Solicitar Cambios

| Paso | Actor | Descripción |
|------|-------|-------------|
| 1 | Consejo | Selecciona SOLICITAR CAMBIOS y asigna Tiempo de Ajuste en días. |
| 2 | Sistema | Estado → "pendiente por ajuste", notifica al Profesor con plazo. |
| 3 | Profesor | Ajusta la solicitud dentro del plazo. |
| 4 | Sistema | Estado → "AJUSTADA". |
| 5 | Coord. Académico | Recibe para nueva revisión. |

### 6.2 Flujo 2: Verificación de Abordaje

| # | Actor | Acción |
|---|-------|--------|
| 1 | Estudiante | Sube foto actualizada (obligatoria). |
| 2 | Estudiante | Genera código alfanumérico de 6 caracteres. |
| 3 | Estudiante | Código activo solo el día y hora de la salida. |
| 4 | Estudiante | Muestra código al Conductor o Profesor. |
| 5 | Conductor/Profesor | Ingresa código en modal de verificación. |
| 6 | Sistema | Muestra foto, nombre e ID para confirmación visual. |
| 7 | Conductor/Profesor | Confirma abordaje. |
| 8 | Sistema | Estado → ABORDADO. Contador actualizado en tiempo real. |
| 9 | Coordinador | Visualiza lista actualizada con quién verificó. |

### 6.3 Flujo 3: Configuración de Parámetros y Cálculo de Costo *(Nuevo v1.1)*

| # | Actor | Acción |
|---|-------|--------|
| 1 | Coordinador | Accede a "Presupuesto Operativo" → sección "Parámetros del Sistema". |
| 2 | Coordinador | Ingresa: Pg, R, C_noche, C_hora. |
| 3 | Sistema | Valida campos completos. |
| 4 | Coordinador | Hace clic en "Guardar Parámetros". |
| 5 | Sistema | Persiste en localStorage. Muestra badge "✓ Guardado". |
| 6 | Coordinador | Usa calculadora ingresando DT, D, Ht. |
| 7 | Sistema | Calcula y muestra: Total + desglose Combustible/Hospedaje/Horas Extra. |
| 8 | Profesor | En Paso 3, ingresa D y Ht. |
| 9 | Sistema | Tarjeta resumen negra muestra Costo Estimado automáticamente. |

---

## 7. MATRIZ DE TRAZABILIDAD

### Módulo Profesor
| HU | RF | Archivo |
|----|----|---------|
| HU-PROF-001 | RF-002, RF-017 | `index.html` |
| HU-PROF-002 | RF-002.1, RF-002.2 | `profesor/solicitud/paso-1-informacion.html` |
| HU-PROF-003 | RF-002.3 | `profesor/solicitud/paso-2-planeacion.html` |
| HU-PROF-004 | RF-002.4, RF-019.6 | `profesor/solicitud/paso-3-logistica.html` |
| HU-PROF-005 | RF-002.5 – 002.9 | `profesor/solicitud/paso-4-evaluacion.html` |
| HU-PROF-006 | — | `profesor/historial.html` *(pendiente)* |
| HU-PROF-007 | — | `profesor/plantillas.html` *(pendiente)* |
| HU-PROF-008 | RF-007 | `profesor/dashboard.html` |
| HU-PROF-009 | RF-008.1 – 008.5, RF-008.7 | `profesor/dashboard.html` |
| HU-PROF-010 | RF-009.4, RF-009.5 | `profesor/dashboard.html` |

### Módulo Coordinador Académico
| HU | RF | Archivo |
|----|----|---------|
| HU-COORD-001 | RF-003, RF-017 | `coordinador/index.html` |
| HU-COORD-002 | RF-003.1 – 003.5 | `coordinador/revision.html` |
| HU-COORD-003 | RF-003 | `coordinador/historial-revisiones.html` *(pendiente)* |
| HU-COORD-004 | RF-003 | `coordinador/salidas-aprobadas.html` |

### Módulo Consejo de Facultad
| HU | RF | Archivo |
|----|----|---------|
| HU-CONS-001 | RF-004, RF-017 | `consejo/index.html` |
| HU-CONS-002 | RF-004.1 – 004.5 | `consejo/detalle-salida.html` |
| HU-CONS-003 | — | `consejo/actas-reportes.html` *(pendiente)* |

### Módulo Coordinador de Salidas
| HU | RF | Archivo |
|----|----|---------|
| HU-CSAL-001 | RF-017 | `coordinador-salidas/index.html` |
| HU-CSAL-002 | RF-005, RF-017 | `coordinador-salidas/salidas-aprobadas.html` |
| HU-CSAL-003 | RF-005.1 – 005.8 | `coordinador-salidas/asignar-transporte.html` |
| HU-CSAL-004 | RF-006.1 – 006.5 | `coordinador-salidas/presupuesto-operativo.html` |
| HU-CSAL-005 | RF-007.1 – 007.5 | `coordinador-salidas/monitoreo-ejecucion.html` |
| HU-CSAL-006 | RF-008.1 – 008.10 | `coordinador-salidas/monitoreo-ejecucion.html` |
| HU-CSAL-007 | RF-012.1 – 012.8 | `coordinador-salidas/cancelar-salida.html` |
| HU-CSAL-008 | RF-013.1 – 013.5 | `coordinador-salidas/cierre-operativo.html` |
| HU-CSAL-009 | RF-014.1 – 014.6 | `coordinador-salidas/reportes-logisticos.html` |
| **HU-CSAL-010** | **RF-018.1–018.7, RF-019.1–019.8** | **`coordinador-salidas/presupuesto-operativo.html`** |

### Módulo Conductor
| HU | RF | Archivo |
|----|----|---------|
| HU-COND-001 | RF-017 | `conductor/index.html` |
| HU-COND-002 | RF-007, RF-008, RF-009 | `conductor/detalle-viaje.html` |
| HU-COND-003 | RF-010.1 – 010.7 | `conductor/checklist.html` |
| HU-COND-004 | RF-011.1 – 011.7 | `conductor/registrar-novedad.html` |
| HU-COND-005 | RF-008.1 – 008.6 | `conductor/detalle-viaje.html` |
| HU-COND-006 | RF-014 | `conductor/historial.html` |

### Módulo Estudiante
| HU | RF | Archivo |
|----|----|---------|
| HU-EST-001 | RF-017 | `estudiante/index.html` |
| HU-EST-002 | RF-016.1 – 016.5 | `estudiante/registro-qr.html` |
| HU-EST-003 | RF-015 | `estudiante/detalle-salida.html` |
| HU-EST-004 | RF-015.1 – 015.5 | `estudiante/mis-documentos.html` |
| HU-EST-005 | RF-014 | `estudiante/historial.html` |
| HU-EST-006 | RF-009.1 – 009.7 | `estudiante/codigo-verificacion.html` |

---

## RESUMEN EJECUTIVO — OTIUM v1.1

| Métrica | Valor |
|---------|-------|
| Historias de Usuario | **37** (35 orig. + 2 nuevas) |
| Grupos de RF | **19** (17 orig. + RF-018 + RF-019) |
| Requerimientos No Funcionales | **10** |
| Flujos de Negocio | **3** |
| Roles | **6** |
| Archivos HTML implementados | **30** |
| Archivos HTML pendientes | **4** (`historial.html` prof, `plantillas.html`, `historial-revisiones.html`, `actas-reportes.html`) |
| Cobertura HU implementadas | **89%** |

> **Nuevo en v1.1:** Módulo de cálculo de costos con parámetros configurables.
> Las variables Pg, R, C_noche y C_hora son editables por el Coordinador de Salidas.
> Sin valores hardcodeados — todo configurable vía panel de administración.

---
*OTIUM — Sistema de Gestión de Salidas de Campo — UPN | v1.1 | 2026-03-04*
