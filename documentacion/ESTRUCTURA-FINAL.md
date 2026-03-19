# Estructura Final del Sistema FOR-DOC-008

## 🏗️ Arquitectura del Layout

### Layout Permanente
```
┌─────────────┬──────────────────────────────────┐
│   SIDEBAR   │  HEADER                          │
│ (Permanente)│  [Usuario] [Foto]                │
│             ├──────────────────────────────────┤
│ FOR-DOC-008 │                                  │
│ Sistema     │  CONTENIDO DINÁMICO              │
│             │  (Cambia según la vista)         │
│ Gestión     │                                  │
│  └─ Salidas │                                  │
│             │                                  │
│ [Estadística│                                  │
│  12 salidas]│                                  │
└─────────────┴──────────────────────────────────┘
```

## 📋 Vistas Principales

### 1. Vista: SALIDAS (Lista/Tabla)
**Archivo**: `profesor/salidas.html`

```
SIDEBAR          │  CONTENIDO
(Permanente)     │
                 │  Header: Dr. Juan Carlos Pérez [Foto]
Gestión          │  ────────────────────────────────
 └─ Salidas ✓    │
                 │  Mis Salidas de Campo  [+ Nueva Salida]
                 │  ┌──────────────────────────────────┐
                 │  │ Nombre │ Asig │ Fecha │ [Editar]│
                 │  ├──────────────────────────────────┤
                 │  │ Salida1│ Eco  │ 15Mar │   [✎]  │
                 │  │ Salida2│ Geo  │ 22Mar │   [👁] │
                 │  └──────────────────────────────────┘
```

**Acciones**:
- Click [+ Nueva Salida] → Va a `solicitud/paso-1-informacion.html`
- Click [✎ Editar] → Va a `solicitud/paso-1-informacion.html` (modo edición)

---

### 2. Vista: FORMULARIO (Wizard 4 pasos)
**Archivos**:
- `profesor/solicitud/paso-1-informacion.html`
- `profesor/solicitud/paso-2-planeacion.html`
- `profesor/solicitud/paso-3-logistica.html`
- `profesor/solicitud/paso-4-evaluacion.html`

```
SIDEBAR          │  CONTENIDO
(Permanente)     │
                 │  Header: Dr. Juan Carlos Pérez [Foto]
Gestión          │  ────────────────────────────────
 └─ Salidas      │
                 │  Stepper: (1)──(2)──(3)──(4)
                 │            ●   ○   ○   ○
                 │
                 │  PASO 1 DE 4
                 │  Información Básica
                 │
                 │  [Formulario...]
                 │
                 │  ← Cancelar    Guardar  Siguiente →
```

**Navegación**:
- Paso 1 → Paso 2 → Paso 3 → Paso 4 → Vuelve a `salidas.html`
- Click "Cancelar" → Vuelve a `salidas.html`

## 📁 Estructura de Archivos

```
wireframe/
│
├── css/
│   ├── design-system.css
│   └── sidebar.css
│
├── profesor/
│   ├── salidas.html                    ← VISTA PRINCIPAL (Tabla)
│   └── solicitud/
│       ├── paso-1-informacion.html     ← Wizard paso 1
│       ├── paso-2-planeacion.html      ← Wizard paso 2
│       ├── paso-3-logistica.html       ← Wizard paso 3
│       └── paso-4-evaluacion.html      ← Wizard paso 4
│
├── compartido/
│   └── sidebar-layout.html             ← Componente reutilizable
│
└── index.html                          ← Landing/Login
```

## 🎯 Flujo de Usuario

```
1. Inicio
   └─> profesor/salidas.html

2. Desde salidas.html:
   │
   ├─ Click [+ Nueva Salida]
   │   └─> solicitud/paso-1-informacion.html
   │       └─> paso-2-planeacion.html
   │           └─> paso-3-logistica.html
   │               └─> paso-4-evaluacion.html
   │                   └─> [Enviar] → Vuelve a salidas.html
   │
   └─ Click [✎ Editar] en fila
       └─> solicitud/paso-1-informacion.html (con datos)
           └─> (Navega por los pasos)
               └─> [Guardar] → Vuelve a salidas.html
```

## 🎨 Componentes del Sidebar

### Sidebar Permanente (Todas las vistas)
```html
<aside class="sidebar">
  <div class="sidebar-header">
    <a class="sidebar-logo">FOR-DOC-008</a>
    <p class="sidebar-subtitle">Sistema de Gestión</p>
  </div>

  <nav class="sidebar-nav">
    <div class="nav-section">
      <h6>Gestión</h6>
      <ul>
        <li><a href="salidas.html">≡ Salidas</a></li>
      </ul>
    </div>
  </nav>

  <div class="sidebar-progress">
    <!-- Estadística: 12 salidas -->
  </div>
</aside>
```

### Header (Todas las vistas)
```html
<header class="page-header">
  <h1>Título de la Vista</h1>
  <div class="user-info">
    <p>Dr. Juan Carlos Pérez</p>
    <p>Profesor</p>
    <div class="user-avatar">JP</div>
  </div>
</header>
```

## ✅ Características

✅ **Sidebar permanente** en todas las vistas
✅ **Header con usuario** consistente
✅ **Tabla de salidas** con acciones (Editar/Ver)
✅ **Botón "Nueva Salida"** en la tabla
✅ **Wizard de 4 pasos** horizontal
✅ **Navegación clara**: Cancelar vuelve a tabla
✅ **Diseño minimalista** editorial

## 🔗 URLs

- Vista principal: `/profesor/salidas.html`
- Nueva salida: `/profesor/solicitud/paso-1-informacion.html`
- Editar salida: `/profesor/solicitud/paso-1-informacion.html?id=123`
