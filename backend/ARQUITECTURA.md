# Arquitectura Hexagonal — Proyecto Otium

## Decisiones de diseño
- Arquitectura hexagonal con vertical slicing por módulo de negocio
- Patrón BFF en api/ — cada carpeta es un rol (profesor, coordinador, conductor, admin_sistema)
- Un módulo de negocio atraviesa todas las capas verticalmente

## Convenciones obligatorias
Todo archivo creado debe tener este encabezado:
```
# CAPA: [Dominio | Aplicación | Infraestructura | API]
# QUÉ HACE: descripción en una línea
# NO DEBE CONTENER: lo que viola la arquitectura
```

## Reglas por capa
- dominio/         → Python puro, sin Django, sin ORM, sin DRF
- aplicacion/      → casos de uso, orquesta dominio + repositorio, sin ORM
- infraestructura/ → ORM, modelos Django, implementación de repositorios
- api/             → vistas y serializers por rol, sin lógica de negocio

## Flujo de dependencias
```
api/ → aplicacion/ → dominio/ ← infraestructura/
```

## Estructura acordada
```
backend/
├── config/                        ← configuración Django
├── dominio/salidas/               ← entidad, puerto, excepciones, valor_objetos
├── aplicacion/salidas/            ← crear, listar, obtener, actualizar, eliminar, enviar
├── infraestructura/salidas/       ← modelo Django, repositorio concreto
└── api/
    ├── profesor/salidas/          ← vistas + serializers (CRUD propio)
    ├── coordinador/salidas/       ← vistas + serializers (aprobar, rechazar)
    ├── conductor/salidas/         ← vistas (ver asignadas)
    └── admin_sistema/salidas/     ← vistas (acceso total)
```

## Estado actual — Backend
- [x] FASE 1 — config/ Django
- [x] FASE 2 — dominio/salidas/
- [x] FASE 3 — aplicacion/salidas/
- [x] FASE 4 — infraestructura/salidas/
- [x] FASE 5 — api/profesor/salidas/
- [x] FASE 6 — compartido/ (constantes, costos, codigos, permisos)
- [x] FASE 6.0 — usuarios (modelo personalizado + AUTH_USER_MODEL)
- [x] FASE 7 — transporte (dominio, aplicacion, infraestructura)
- [x] FASE 12 — parametros (dominio, aplicacion, infraestructura)
- [x] calcular_costo endpoint
- [ ] FASE 8 — presupuesto
- [ ] FASE 9 — checklist
- [ ] FASE 10 — novedades
- [ ] FASE 11 — abordaje
- [ ] FASE 13 — APIs por rol (coordinador, conductor, admin)
- [ ] FASE 14 — migraciones finales + datos iniciales

## Violaciones prohibidas
- Queries ORM fuera de infraestructura/
- Imports de modelos Django fuera de infraestructura/
- Lógica de negocio en vistas
- Casos de uso que reciben modelos ORM como parámetro
- Imports sin usar

## Excepciones documentadas

### infraestructura/usuarios/models.py
Todos los módulos usan `modelo.py` + `ready()` para registrar modelos.
**Excepción justificada:** `infraestructura/usuarios/` usa `models.py`
porque Django necesita auto-descubrir AUTH_USER_MODEL en la fase 2
de carga, antes de que ready() se ejecute. Cambiar esto rompe el admin.

---

## Estado actual — Frontend

### Estructura hexagonal frontend (src/)
```
src/
├── compartido/        ← api, hooks, estado, componentes globales
├── infraestructura/   ← repositorios HTTP (salidas, abordaje, checklist, novedades)
├── sistema-diseno/    ← variables CSS, design tokens Teal/Cyan
├── rutas/             ← RutasProtegidas
└── ui/                ← vistas por rol (BFF frontend)
    ├── profesor/      ← tablero, mapa, pasos, logistica, paginas
    ├── conductor/     ← abordaje, checklist, novedades
    ├── coordinador/   ← pendiente
    ├── admin/         ← panel herramientas
    ├── autenticacion/ ← login
    └── tablero/       ← tablero general
```

### Convenciones frontend
- Alias `@/` apunta a `src/` (vite.config.js)
- `clienteHttp.js` — Axios con interceptores JWT (inyección de dependencias)
- `useAutenticacion` — Zustand con persistencia localStorage
- CSS colocado junto al componente (co-location)
- Sin Tailwind — design tokens en `variables.css`
- `frontend_backup/` — backup de la estructura anterior

### Estado endpoints conectados
- `POST /api/auth/login/`                        ✅
- `GET  /api/profesor/salidas/`                   ✅
- `POST /api/profesor/salidas/`                   ✅
- `PUT  /api/profesor/salidas/<id>/`              ✅
- `DELETE /api/profesor/salidas/<id>/`             ✅
- `POST /api/profesor/salidas/<id>/enviar/`        ✅
- `POST /api/profesor/salidas/<id>/calcular-costo/` ✅
