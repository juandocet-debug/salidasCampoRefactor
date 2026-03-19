# Estructura del Proyecto FOR-DOC-008

## 📁 Organización de Carpetas

```
wireframe/
│
├── 📂 css/
│   ├── design-system.css          # Sistema de diseño base
│   └── sidebar.css                # Estilos del sidebar
│
├── 📂 profesor/                   # Vistas del PROFESOR
│   ├── dashboard.html             # Dashboard principal
│   └── 📂 solicitud/              # Flujo de solicitud (4 pasos)
│       ├── paso-1-informacion.html
│       ├── paso-2-planeacion.html
│       ├── paso-3-logistica.html
│       └── paso-4-evaluacion.html
│
├── 📂 coordinador/                # Vistas del COORDINADOR
│   ├── dashboard.html             # (Por implementar)
│   ├── revisar-solicitud.html     # (Por implementar)
│   └── aprobar-solicitud.html     # (Por implementar)
│
├── 📂 conductor/                  # Vistas del CONDUCTOR
│   └── tracking-ruta.html         # (Por implementar)
│
├── 📂 compartido/                 # Componentes compartidos
│   └── (componentes reutilizables)
│
├── index.html                     # Landing/Login principal
└── README.md                      # Documentación
```

## 🎯 Stakeholders y Rutas

### 👨‍🏫 PROFESOR
**Ruta base**: `/profesor/`

| Archivo | Descripción |
|---------|-------------|
| `dashboard.html` | Lista de salidas (borradores, aprobadas, cerradas) |
| `solicitud/paso-1-informacion.html` | Información básica + Justificación |
| `solicitud/paso-2-planeacion.html` | Objetivos + Metodología |
| `solicitud/paso-3-logistica.html` | Programación ruta + Actividades |
| `solicitud/paso-4-evaluacion.html` | Evaluación + Post + Cierre |

### 👔 COORDINADOR
**Ruta base**: `/coordinador/`

| Archivo | Descripción |
|---------|-------------|
| `dashboard.html` | Solicitudes pendientes de aprobación |
| `revisar-solicitud.html` | Revisar solicitud completa |
| `aprobar-solicitud.html` | Aprobar/Rechazar con comentarios |

### 🚗 CONDUCTOR/TRANSPORTE
**Ruta base**: `/conductor/`

| Archivo | Descripción |
|---------|-------------|
| `tracking-ruta.html` | Tracking en tiempo real (tipo Uber) |
| `registro-tiempos.html` | Registro de salida/llegada |

## 🔗 Navegación

### Desde el Profesor:
```
index.html
  └─> profesor/dashboard.html
       └─> profesor/solicitud/paso-1-informacion.html
            └─> paso-2-planeacion.html
                 └─> paso-3-logistica.html
                      └─> paso-4-evaluacion.html
                           └─> (submit) → dashboard.html
```

### Rutas Relativas:
- Desde **profesor/dashboard.html** → `solicitud/paso-1-informacion.html`
- Desde **profesor/solicitud/paso-1.html** → `../dashboard.html`
- Desde **cualquier paso** → `../../css/design-system.css`

## 📋 Convenciones de Nombres

### Archivos HTML:
- `dashboard.html` - Vista principal de cada stakeholder
- `paso-{N}-{nombre}.html` - Pasos del wizard
- `{accion}-{entidad}.html` - Acciones específicas

### CSS:
- `design-system.css` - Sistema de diseño global
- `{componente}.css` - Estilos específicos de componente

## ✅ Implementado

- ✅ Estructura de carpetas
- ✅ Dashboard profesor
- ✅ Paso 1: Información
- ✅ Paso 2: Planeación
- ✅ Sistema de diseño CSS
- ✅ Sidebar con 4 pasos agrupados
- ✅ Navegación horizontal (stepper)

## 🔄 Por Implementar

- ⏳ Paso 3: Logística
- ⏳ Paso 4: Evaluación
- ⏳ Vistas del Coordinador
- ⏳ Vistas del Conductor
- ⏳ Landing page principal
