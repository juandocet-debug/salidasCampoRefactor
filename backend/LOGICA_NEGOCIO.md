# Lógica de Negocio — Proyecto Otium (Extraído de backend_backup)

> Fuente: `backend_backup/` — Todo el código existente que debe portarse al nuevo proyecto hexagonal.

---

## 1. CONSTANTES GLOBALES (`aplicaciones/nucleo/constantes.py`)

### Roles del sistema
```python
class Roles:
    PROFESOR              = 'profesor'
    COORDINADOR_ACADEMICO = 'coordinador_academico'
    CONSEJO               = 'consejo'
    COORDINADOR_SALIDAS   = 'coordinador_salidas'
    ADMIN_SISTEMA         = 'admin_sistema'
    CONDUCTOR             = 'conductor'
    ESTUDIANTE            = 'estudiante'
```

### Estados del ciclo de vida de una salida
```
BORRADOR → ENVIADA → EN_REVISION → FAVORABLE → APROBADA → EN_PREPARACION → EN_EJECUCION → FINALIZADA → CERRADA
                                  → PENDIENTE_AJUSTE → AJUSTADA ↩ EN_REVISION
                                  → RECHAZADA
                                  → CANCELADA (desde cualquier estado activo)
```

### Tipos de novedad
`mecanica, accidente, clima, vial, salud, otro`

### Urgencias
`baja, media, alta, critica`

### Tipos de documento estudiante
`identidad, eps_arl, consentimiento, poliza`

### Concepto de revisión (Coordinador Académico)
`favorable, favorable_con_ajustes, no_favorable`

### Decisión del Consejo
`aprobada, solicitar_cambios, rechazada`

---

## 2. FÓRMULA DE COSTO (`aplicaciones/nucleo/servicios/costo.py`)

### Modelo matemático
```
CostoTotal = CostoGasolina + CostoConductor
CostoConductor = Viáticos + HE_Mañana + HE_Tarde + HE_Noche
```

### Jornada
- Ordinaria: 8:00am - 5:00pm (9h)
- HE Mañana: 5am-8am → $11,000/h (HE1)
- HE Tarde: 5pm-6pm → $11,000/h (HE1)
- HE Noche: 6pm-8pm → $15,000/h (HE2)
- Límite absoluto: 8pm (20:00)

### Función pura (sin Django, sin BD)
```python
@dataclass
class ResultadoCosto:
    total:                    int
    combustible:              int
    viaticos_conductor:       int
    horas_extra_total:        int
    he_manana_costo:          int
    he_tarde_costo:           int
    he_noche_costo:           int
    viaticos_cantidad:        float
    he_manana_cantidad:       float
    he_tarde_cantidad:        float
    he_noche_cantidad:        float
    horas_ordinarias:         float
    horas_extra_total_cantidad: float
    hora_fin_estimada:        float

def calcular_costo_salida(
    distancia_km, duracion_dias, horas_totales,
    precio_galon, rendimiento, costo_noche,
    costo_hora_extra, costo_hora_extra_2=15000,
    max_horas_viaje=10, horas_buffer=1,
    hora_inicio=None, hora_fin=None,
) -> ResultadoCosto:
```

### Algoritmo paso a paso:
1. **Gasolina**: `(distancia_km / rendimiento) * precio_galon`
2. **Viáticos**: `max(0.5, duracion_dias - 0.5) * costo_noche`
3. **Horas efectivas**: `min(horas_totales + horas_buffer, max_horas_viaje * duracion_dias)`
4. **HE por bandas** (viaje 1 día):
   - Si `hora_inicio < 8am` → HE mañana = `8 - hora_inicio`
   - Ordinarias = `min(restante, 9h)`
   - HE tarde = `min(restante, 1h)`
   - HE noche = `min(restante, 2h)`
5. **HE multi-día**: misma lógica escalada × `duracion_dias`
6. **Total**: `combustible + viáticos + he_total`

---

## 3. RECÁLCULO MASIVO (`aplicaciones/nucleo/servicios/recalcular.py`)

Cuando el Admin cambia parámetros del sistema → recalcula TODAS las salidas con `distancia > 0`:
```python
def recalcular_costos_salidas():
    params = ParametrosSistema.obtener()
    for salida in Salida.objects.filter(distancia_total_km__gt=0):
        rendimiento = params.rendimiento_para_tipo(salida.tipo_vehiculo_calculo or 'bus')
        resultado = calcular_costo_salida(...)
        if salida.costo_estimado != resultado.total:
            salida.costo_estimado = resultado.total
            salida.save(update_fields=['costo_estimado'])
```

---

## 4. CÓDIGO DE ABORDAJE (`aplicaciones/nucleo/servicios/codigos.py`)

```python
CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  # Sin I, O, 0, 1

def generar_codigo(longitud=6) -> str:
    return ''.join(secrets.choice(CARACTERES) for _ in range(longitud))

def calcular_expiracion(fecha_salida) -> datetime:
    # Válido hasta 23:59:59 del día de la salida
```

---

## 5. PERMISOS POR ROL (`aplicaciones/nucleo/permisos.py`)

DRF permission classes:
| Clase | Rol permitido |
|---|---|
| `EsProfesor` | profesor + admin |
| `EsCoordinadorAcademico` | coordinador_academico + admin |
| `EsConsejo` | consejo + admin |
| `EsCoordinadorSalidas` | coordinador_salidas + admin |
| `EsConductor` | conductor + admin |
| `EsEstudiante` | estudiante + admin |
| `EsAdminSistema` | admin_sistema + superuser |
| `EsGestorFlota` | cualquier autenticado |

---

## 6. TRANSPORTE (Dominio)

### Value Objects
```python
class TipoVehiculo(str, Enum):    bus, buseta, microbus, camioneta, furgon
class EstadoVehiculo(str, Enum):  disponible, en_servicio, mantenimiento
class Propietario(str, Enum):     institucional, externo
class TipoCombustible(str, Enum): diesel, gasolina, gas
class TipoTransporte(str, Enum):  propio, externo
```

### Entidad: Vehiculo
```python
@dataclass
class Vehiculo:
    id, placa, tipo, marca, modelo, anio, capacidad,
    rendimiento_kmgal (default 8.0), tipo_combustible, propietario,
    estado_tecnico, foto_url, notas

    def validar_disponibilidad()   # → VehiculoNoDisponible
    def validar_capacidad(n)       # → CapacidadInsuficiente
    def etiqueta → "PLACA MARCA MODELO"
```

### Entidad: Asignacion
```python
@dataclass
class Asignacion:
    id, salida_id, vehiculo_id, conductor_id,
    tipo_transporte (propio/externo), empresa_externa, confirmado_en

    def confirmar(ahora)
    def es_externo → bool
```

### Excepciones
- `VehiculoNoDisponible(placa)`
- `CapacidadInsuficiente(capacidad, requeridos)`

---

## 7. PRESUPUESTO (Dominio)

```python
class CategoriaGasto(str, Enum): combustible, hospedaje, alimentacion, entrada, otro

@dataclass
class Gasto:
    id, presupuesto_id, categoria, descripcion, monto, fecha, registrado_por_id

@dataclass
class Presupuesto:
    id, salida_id, total_asignado, ejecutado, gastos: list[Gasto]

    def registrar_gasto(gasto)    # → PresupuestoExcedido si monto > disponible
    def recalcular_ejecutado()
    def disponible → total - ejecutado
    def porcentaje_ejecutado → %
    def esta_en_alerta → True si >= 80%
```

### Excepción
- `PresupuestoExcedido(disponible, monto)`

---

## 8. ABORDAJE (Dominio)

### Value Objects
```python
class EstadoDocumento(str, Enum): vigente, vencido, no_cargado
class TipoDocumento(str, Enum):   identidad, eps_arl, consentimiento, poliza
class RolVerificador(str, Enum):  conductor, profesor
```

### Entidad: RegistroAbordaje
```python
@dataclass
class RegistroAbordaje:
    id, salida_id, estudiante_id, codigo, codigo_expira_en,
    abordado, verificado_por_id, rol_verificador, verificado_en, foto_url

    def activar_codigo(codigo, expira)  # → FotoRequeridaParaCodigo si no hay foto
    def confirmar_abordaje(codigo, ahora, verificador_id, rol)
        # Valida: no ya abordado, código correcto, no expirado
        # → EstudianteYaAbordado, CodigoInvalido
    def tiene_codigo_activo → bool
```

### Entidad: DocumentoEstudiante
```python
@dataclass
class DocumentoEstudiante:
    id, estudiante_id, tipo, archivo_url, estado, fecha_vencimiento
    def esta_vigente → bool
```

### Excepciones
- `CodigoInvalido(codigo)`
- `EstudianteYaAbordado(estudiante_id, salida_id)`
- `FotoRequeridaParaCodigo()`

---

## 9. CHECKLIST (Dominio)

### Value Objects
```python
class CategoriaChecklist(str, Enum): mecanica, seguridad, documentos, confort
class EstadoItem(str, Enum): ok, no_ok, na, pendiente
```

### 18 ítems predeterminados
| Categoría | Ítems |
|---|---|
| Mecánica | Aceite, radiador, llantas, frenos, luces, dirección |
| Seguridad | Extintor, botiquín, triángulos, cinturones, puertas emergencia |
| Documentos | Licencia, SOAT, revisión técnico-mecánica, tarjeta propiedad |
| Confort | A/C, limpieza, asientos |

### Entidad: ItemChecklist
```python
@dataclass
class ItemChecklist:
    id, asignacion_id, categoria, item, estado=PENDIENTE, observacion, evidencia_url
    def marcar(estado, observacion)
```

### Agregado: Checklist
```python
@dataclass
class Checklist:
    asignacion_id, items: list[ItemChecklist]

    def puede_iniciar_viaje() → True si 0 pendientes (RF-010.7)
    def items_no_ok() → lista
    def progreso → {total, completados, pendientes, porcentaje}
    @classmethod nuevo_para_asignacion(id) → Checklist con 18 ítems
```

---

## 10. NOVEDADES (Dominio)

```python
class TipoNovedad(str, Enum): mecanica, accidente, clima, vial, salud, otro
class Urgencia(str, Enum): baja, media, alta, critica
class EstadoNovedad(str, Enum): abierta, resuelta

@dataclass
class Novedad:
    id, salida_id, tipo, urgencia, descripcion, estado=ABIERTA,
    latitud, longitud,  # GPS automático
    reportado_por_id, registrado_en, resuelto_en

    def resolver(ahora)   # Solo desde ABIERTA
    def es_critica → bool
    def tiene_ubicacion → bool
```

---

## 11. PARÁMETROS — Puertos (Dominio)

Interfaces para gestionar datos maestros:
```python
class IParametrosRepositorio:    obtener(), guardar(datos, usuario)
class IFacultadRepositorio:      listar_todas/activas(), CRUD, sincronizar_programas()
class IProgramaRepositorio:      listar(facultad_id?), listar_activos(), CRUD
class IVentanaRepositorio:       listar_todas/activas(), CRUD
```

---

## 12. IA — Municipios en ruta (`aplicaciones/nucleo/vistas/ia/municipios.py`)

Endpoint: `POST /api/nucleo/municipios-en-ruta/`

```
Body: { "origen": "Bogotá", "destino": "Medellín" }
Respuesta: { "municipios": [{"nombre":"Villeta","depto":"Cundinamarca"}, ...] }
```

Flujo:
1. Groq (Llama) → primario
2. Gemini → fallback
3. Prompt pide solo municipios SOBRE la vía principal (no desvíos)
4. Máximo 30 municipios, respuesta JSON pura

---

## 13. RESUMEN DE MÓDULOS PARA PORTAR

| Módulo | Dominio | Aplicación | Infra | API |
|---|---|---|---|---|
| **salidas** | ✅ portado | ✅ portado | ✅ portado | ✅ portado (profesor) |
| **transporte** | entidades + VOs | casos_uso.py | repositorio | pendiente |
| **presupuesto** | entidades | casos_uso.py | repositorio | pendiente |
| **abordaje** | entidades + VOs + exc | confirmar_abordaje | repositorio | pendiente |
| **checklist** | entidades (18 ítems) | casos_uso.py | repositorio | pendiente |
| **novedades** | entidades | casos_uso.py | repositorio | pendiente |
| **parametros** | puertos (interfaces) | gestionar_* | repositorio | pendiente |
| **nucleo** | — | costo, codigos, recalcular, permisos, IA | — | vistas IA |
