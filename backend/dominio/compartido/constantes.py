# CAPA: Dominio — Compartido
# QUÉ HACE: Constantes y enums compartidos entre múltiples módulos
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from enum import Enum


class Rol(str, Enum):
    PROFESOR      = 'profesor'
    COORDINADOR   = 'coordinador'
    CONDUCTOR     = 'conductor'
    ADMIN_SISTEMA = 'admin_sistema'


class TipoNovedad(str, Enum):
    ACCIDENTE     = 'accidente'
    RETRASO       = 'retraso'
    MECANICA      = 'mecanica'
    CLIMA         = 'clima'
    OTRO          = 'otro'


class Urgencia(str, Enum):
    BAJA   = 'baja'
    MEDIA  = 'media'
    ALTA   = 'alta'
    CRITICA = 'critica'


class TipoDocumento(str, Enum):
    CEDULA         = 'cedula'
    TARJETA_IDENTIDAD = 'tarjeta_identidad'
    PASAPORTE      = 'pasaporte'


class ConceptoRevision(str, Enum):
    FAVORABLE         = 'favorable'
    PENDIENTE_AJUSTE  = 'pendiente_ajuste'
    RECHAZADO         = 'rechazado'


class DecisionConsejo(str, Enum):
    APROBADA  = 'aprobada'
    RECHAZADA = 'rechazada'
