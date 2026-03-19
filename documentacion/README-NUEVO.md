# Sistema de Solicitud FOR-DOC-008 - Versión Mejorada

## 🎯 Cambios de UX Implementados

### ❌ ANTES (Problema)
```
Sidebar con 11 secciones verticales:
├─ A: Información General
├─ B: Justificación
├─ C: Objetivos
├─ D: Competencias
├─ E: Metodología
├─ F: Programación
├─ G: Actividades
├─ H: Evaluación
├─ I: Evaluación Post
├─ J: Tiempos Reales
└─ K: Cierre

❌ Demasiado vertical
❌ Abrumador
❌ 11 items en la lista
```

### ✅ AHORA (Solución)
```
Sidebar simplificado con 4 pasos:
├─ 1. Información
├─ 2. Planeación
├─ 3. Logística
└─ 4. Evaluación

✅ Navegación HORIZONTAL (wizard)
✅ Sidebar limpio con solo 4 items
✅ Stepper visual en el contenido
✅ Título: "SOLICITUD"
```

## 📁 Estructura Nueva

```
wireframe/
├── index.html (Dashboard con sidebar)
├── paso-1-informacion.html (Información + Justificación)
├── paso-2-planeacion.html (Objetivos + Competencias + Metodología)
├── paso-3-logistica.html (Programación + Actividades)
├── paso-4-evaluacion.html (Evaluación + Post + Cierre)
└── css/
    ├── design-system.css
    └── sidebar.css (200px width)
```

## 🎨 Características UX

### 1. Sidebar Consistente
- **Ancho**: 200px (más compacto)
- **Título**: "SOLICITUD"
- **Items**: Solo 4 pasos agrupados
- **Presente en**: TODAS las páginas (incluido index.html)

### 2. Navegación Horizontal
- Stepper visual en la parte superior
- Progreso claro: "Paso 1 de 4"
- Barra de progreso animada

### 3. Agrupación Inteligente

**Paso 1: Información**
- Datos generales
- Justificación académica

**Paso 2: Planeación**
- Objetivos (general + específicos)
- Competencias
- Metodología

**Paso 3: Logística**
- Programación de ruta (tipo Uber)
- Sub-tramos pedagógicos
- Actividades en campo

**Paso 4: Evaluación**
- Criterios de evaluación
- Post-ejecución
- Tiempos reales
- Cierre

## 🚀 Ventajas

✅ **Menos abrumador**: 4 pasos vs 11 secciones
✅ **Más rápido**: Wizard guiado paso a paso
✅ **Mobile-friendly**: Flujo horizontal se adapta mejor
✅ **Progreso claro**: Visual y numérico
✅ **Consistente**: Mismo sidebar en todas las páginas

## 📱 Responsive

- **Desktop**: Sidebar fijo + stepper horizontal
- **Tablet**: Sidebar colapsable
- **Mobile**: Navegación por pasos completa
