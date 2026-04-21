# Plan de Pruebas Integrales OTIUM

Este documento define la estructura y los casos de uso para ejecutar pruebas funcionales E2E (End-to-End) y pruebas rigurosas de campos de formulario (Frontend/UX), desde la perspectiva de todos los perfiles de usuario involucrados en el ecosistema.

---

## 1. Perfil Módulo Docente (Profesor)

**Descripción del rol:** El Docente es el creador de las peticiones iniciales. Carga itinerarios, llena campos académicos y subsana los errores o ajustes solicitados.

### Casos de Prueba de Formularios (Validaciones UI)
- [ ] **CP-PROF-FORM-01: Validaciones de Asignatura y Estudiantes (Paso 1)**
  - **Acción:** Dejar vacíos los campos obligatorios (Nombre, Asignatura) o poner cero estudiantes e intentar "Continuar".
  - **Resultado Esperado:** El asistente no permite avanzar. Muestra mensajes de error en rojo bajo cada input (`Este campo es requerido`, `Debe ser mayor a 0`).
  
- [ ] **CP-PROF-FORM-02: Fechas y Calendario Invertido (Paso 2)**
  - **Acción:** Seleccionar una `Fecha de Retorno` anterior a la `Fecha de Salida`.
  - **Resultado Esperado:** El sistema resalta las fechas en rojo y arroja un toast error impidiendo el avance (No pueden haber viajes que lleguen antes de salir).

- [ ] **CP-PROF-FORM-03: Mapa y Autocompletado de Rutas (Paso 2)**
  - **Acción:** Escribir caracteres basurilla en el buscador del mapa georeferenciado (ej: `asdkasdajks`).
  - **Resultado Esperado:** Mensaje de "No se encontraron poblaciones". 
  - **Acción B:** Seleccionar válidamente "Bogotá" y "Salento", crear una ruta y guardar.
  - **Resultado Esperado:** El mapa debe recalcular la distancia y guardar la persistencia del _GeoJSON_ (los pines morados).

- [ ] **CP-PROF-FORM-04: Persistencia Parcial (Borrador Activo)**
  - **Acción:** Completar el Paso 1 y Paso 2, recargar la página (F5) o volver al tablero de control sin enviar.
  - **Resultado Esperado:** La información del formulario no se pierde, el backend ha guardado el estado de los inputs parcialmente.

### Casos de Prueba Transaccionales (Flujo)
- [ ] **CP-PROF-FLUJO-01:** Completar todo el wizard y hacer click en "Enviar a Revisión". Confirmar que la modal restrinja doble-clic para evitar spam a la red.
- [ ] **CP-PROF-FLUJO-02:** Revisión del Historial con "Badges". Validar que la interfaz se bloquea (Inputs deshabilitados si está `en_revision`).

---

## 2. Perfil Módulo Coordinación (Área Pedagógica)

**Descripción del rol:** Revisa pedagógicamente las salidas. Valida pertinencia, objetivos y viabilidad para decidir si llega a ser vista por consejo o se devuelve al profesor.

### Casos de Prueba de Formularios (Validaciones UI)
- [ ] **CP-COORD-FORM-01: Modal de Matriz de Evaluación Válida**
  - **Acción:** Clickear en "Aprobar", "Parcial" o "No Cumple" en los 4 criterios de forma mixta.
  - **Resultado Esperado:** La plataforma de radio-buttons almacena la selección en el estado visual (colores semánticos verde/naranja/rojo).
  
- [ ] **CP-COORD-FORM-02: Seguridad contra Texto Vacío en Devolución**
  - **Acción:** Evaluar con al menos un "No Cumple" y luego presionar "Enviar Revisión" dejando el campo de texto (Justificación/Observaciones) vacío.
  - **Resultado Esperado:** El formulario prohíbe el envío y exige una argumentación en texto obligatoria del por qué de la devolución.

### Casos de Prueba Transaccionales (Flujo)
- [ ] **CP-COORD-FLUJO-01:** Generar evaluación favorable total -> Estado final: `favorable`.
- [ ] **CP-COORD-FLUJO-02:** Guardar evaluación de Ajuste -> Estado final: `pendiente_ajuste`. Se debe borrar de la pantalla de "Pendientes" instantáneamente y los contadores en tiempo real se actualizan.

---

## 3. Perfil Consejo de Facultad

**Descripción del rol:** El nivel máximo jerarquico actual; tienen la última palabra de asignación viabilidad legal o financiera.

### Casos de Prueba de Formularios (Validaciones UI)
- [ ] **CP-CONS-FORM-01: Validación de Número de Acta y Fecha**
  - **Acción:** Intentar registrar la decisión oficial del Consejo sin escribir un número de acta o fecha del comité.
  - **Resultado Esperado:** El botón de "Aprobar" vs "Rechazar" permanece bloqueado o arroja alerta de que `Acta` y `Fecha` son elementos de auditoría requeridos.

- [ ] **CP-CONS-FORM-02: Límite de Caracteres y Ruptura de UI**
  - **Acción:** Pegar un texto enorme (ej: 50.000 caracteres de "Lorem ipsum") sin saltos de línea dentro del campo de observaciones y enviar.
  - **Resultado Esperado:** El Input o Textarea recorta o advierte sobre el límite máximo. En modo de lectura, las tarjetas de histórico del Profesor realizan *line-break* (rompen línea) y la interfaz de lectura no se desborda horizontalmente hacia el infinito.

### Casos de Prueba Transaccionales (Flujo)
- [ ] **CP-CONS-FLUJO-01:** Aprobar salida que venía como favorable. Debe aparecer modal de éxito.
- [ ] **CP-CONS-FLUJO-02:** Solicitar ajuste. El estado de la petición (salida) retrocede hacia el Profesor, sumiendo el rol de Coordinación temporalmente (haciendo _bypass_ de vuelta).

---

## 4. Perfil Administrador del Sistema General

**Descripción del rol:** Define jerarquías globales, visualiza flotas (vehículos, conductores).

### Casos de Prueba (CP)
- [ ] **CP-ADMN-01: Catálogo de Vehículos (Logística inicial)**
  - **Acción:** Ir al Tab de flota e intentar listar buses generados (Mock data actual).
  - **Resultado Esperado:** Grid visual renderizando correctamente KPIs estructurales (disponibilidad).
  
- [ ] **CP-ADMN-02: Validar Accesos cruzados y CORS (Estabilidad)**
  - **Acción:** Tratar de ejecutar cruce de APIs desde diferentes puertos si están aislados, validar conectividad del servicio de geolocalización de rutas (el plugin open-source de OSM implementado en pasos del profesor).
  - **Resultado Esperado:** Carga de mapas de Origen-Llegada de manera ininterrumpida y sin caídas por origin cross requests.

---

### Resumen de Componentes Clave de UI a Testear Form-by-Form:
* **Steppers (Multi-paso):** Transiciones suaves entre pestañas sin lag y persistencia de memoria entre saltos.
* **Selectores de Autocompletado:** Comportamiento frente a respuestas tardías (Debounce de consultas).
* **Botones "Submit":** Estado de Spinner de Carga obligatoria para evitar llamadas fantasma duplicadas o dobles `INSERT` en Bases de Datos.
