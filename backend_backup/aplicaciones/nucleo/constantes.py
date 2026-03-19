# aplicaciones/nucleo/constantes.py
# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES GLOBALES DEL SISTEMA
# Usar siempre estas constantes en lugar de strings literales.
# ─────────────────────────────────────────────────────────────────────────────

# ── Roles del sistema ─────────────────────────────────────────────────────────
class Roles:
    PROFESOR              = 'profesor'
    COORDINADOR_ACADEMICO = 'coordinador_academico'
    CONSEJO               = 'consejo'
    COORDINADOR_SALIDAS   = 'coordinador_salidas'
    ADMIN_SISTEMA         = 'admin_sistema'
    CONDUCTOR             = 'conductor'
    ESTUDIANTE            = 'estudiante'

    OPCIONES = [
        (PROFESOR,              'Profesor'),
        (COORDINADOR_ACADEMICO, 'Coordinador Académico'),
        (CONSEJO,               'Consejo de Facultad'),
        (COORDINADOR_SALIDAS,   'Coordinador de Salidas'),
        (ADMIN_SISTEMA,         'Administrador del Sistema'),
        (CONDUCTOR,             'Conductor'),
        (ESTUDIANTE,            'Estudiante'),
    ]

# ── Estados del ciclo de vida de una salida ───────────────────────────────────
class EstadosSalida:
    BORRADOR         = 'borrador'
    ENVIADA          = 'enviada'
    EN_REVISION      = 'en_revision'
    FAVORABLE        = 'favorable'
    PENDIENTE_AJUSTE = 'pendiente_ajuste'
    AJUSTADA         = 'ajustada'
    APROBADA         = 'aprobada'
    RECHAZADA        = 'rechazada'
    EN_PREPARACION   = 'en_preparacion'
    EN_EJECUCION     = 'en_ejecucion'
    FINALIZADA       = 'finalizada'
    CERRADA          = 'cerrada'
    CANCELADA        = 'cancelada'

    OPCIONES = [
        (BORRADOR,         'Borrador'),
        (ENVIADA,          'Enviada'),
        (EN_REVISION,      'En Revisión'),
        (FAVORABLE,        'Favorable'),
        (PENDIENTE_AJUSTE, 'Pendiente de Ajuste'),
        (AJUSTADA,         'Ajustada'),
        (APROBADA,         'Aprobada'),
        (RECHAZADA,        'Rechazada'),
        (EN_PREPARACION,   'En Preparación'),
        (EN_EJECUCION,     'En Ejecución'),
        (FINALIZADA,       'Finalizada'),
        (CERRADA,          'Cerrada'),
        (CANCELADA,        'Cancelada'),
    ]

# ── Tipos de novedad ──────────────────────────────────────────────────────────
class TiposNovedad:
    MECANICA  = 'mecanica'
    ACCIDENTE = 'accidente'
    CLIMA     = 'clima'
    VIAL      = 'vial'
    SALUD     = 'salud'
    OTRO      = 'otro'

    OPCIONES = [
        (MECANICA,  'Mecánica'),
        (ACCIDENTE, 'Accidente'),
        (CLIMA,     'Clima'),
        (VIAL,      'Vial'),
        (SALUD,     'Salud'),
        (OTRO,      'Otro'),
    ]

# ── Urgencias ─────────────────────────────────────────────────────────────────
class Urgencias:
    BAJA    = 'baja'
    MEDIA   = 'media'
    ALTA    = 'alta'
    CRITICA = 'critica'

    OPCIONES = [
        (BAJA,    'Baja'),
        (MEDIA,   'Media'),
        (ALTA,    'Alta'),
        (CRITICA, 'Crítica'),
    ]

# ── Tipos de documento del estudiante ────────────────────────────────────────
class TiposDocumento:
    IDENTIDAD      = 'identidad'
    EPS_ARL        = 'eps_arl'
    CONSENTIMIENTO = 'consentimiento'
    POLIZA         = 'poliza'

    OPCIONES = [
        (IDENTIDAD,      'Documento de Identidad'),
        (EPS_ARL,        'EPS / ARL'),
        (CONSENTIMIENTO, 'Consentimiento Informado'),
        (POLIZA,         'Póliza de Seguro'),
    ]

# ── Concepto del coordinador académico ───────────────────────────────────────
class ConceptoRevision:
    FAVORABLE    = 'favorable'
    CON_AJUSTES  = 'favorable_con_ajustes'
    NO_FAVORABLE = 'no_favorable'

    OPCIONES = [
        (FAVORABLE,    'Favorable'),
        (CON_AJUSTES,  'Favorable con Ajustes'),
        (NO_FAVORABLE, 'No Favorable'),
    ]

# ── Decisión del Consejo de Facultad ─────────────────────────────────────────
class DecisionConsejo:
    APROBAR          = 'aprobada'
    SOLICITAR_CAMBIOS = 'solicitar_cambios'
    RECHAZAR         = 'rechazada'

    OPCIONES = [
        (APROBAR,           'Aprobada'),
        (SOLICITAR_CAMBIOS, 'Solicitar Cambios'),
        (RECHAZAR,          'Rechazada'),
    ]
