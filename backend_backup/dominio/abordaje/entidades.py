# dominio/abordaje/entidades.py
# ─────────────────────────────────────────────────────────────────────────────
# ENTIDADES DE DOMINIO del slice Abordaje
# ⚠️  Python puro — cero imports de Django.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from .valor_objetos import EstadoDocumento, TipoDocumento, RolVerificador
from .excepciones import (
    CodigoInvalido,
    EstudianteYaAbordado,
    FotoRequeridaParaCodigo,
)


@dataclass
class RegistroAbordaje:
    """
    Representa la participación de UN estudiante en UNA salida.

    Reglas de negocio que viven aquí:
    - No se puede generar código sin foto cargada.
    - No se puede confirmar abordaje con código incorrecto o expirado.
    - No se puede abodar dos veces.
    """
    # ── Identidad ──────────────────────────────────────────────────────────
    id:            Optional[int] = None
    salida_id:     Optional[int] = None
    estudiante_id: Optional[int] = None

    # ── Código de verificación (6 chars alfanumérico) ──────────────────────
    codigo:           str                = ''
    codigo_expira_en: Optional[datetime] = None

    # ── Estado de abordaje ─────────────────────────────────────────────────
    abordado:          bool              = False
    verificado_por_id: Optional[int]    = None
    rol_verificador:   Optional[RolVerificador] = None
    verificado_en:     Optional[datetime] = None

    # ── Foto del estudiante (obligatoria para generar código) ──────────────
    foto_url: str = ''

    # ══════════════════════════════════════════════════════════════════════
    # COMPORTAMIENTO DE NEGOCIO
    # ══════════════════════════════════════════════════════════════════════

    def activar_codigo(self, codigo_generado: str, expira_en: datetime) -> None:
        """
        El estudiante genera su código de verificación.
        Regla (HU-EST-006): requiere foto cargada.
        """
        if not self.foto_url:
            raise FotoRequeridaParaCodigo()
        self.codigo           = codigo_generado
        self.codigo_expira_en = expira_en

    def confirmar_abordaje(
        self,
        codigo_ingresado: str,
        ahora: datetime,
        verificador_id: int,
        rol: RolVerificador,
    ) -> None:
        """
        Conductor o Profesor ingresan el código para confirmar el abordaje.

        Validaciones:
        1. El estudiante no haya abordado ya.
        2. El código coincida.
        3. El código no haya expirado.
        """
        if self.abordado:
            raise EstudianteYaAbordado(self.estudiante_id, self.salida_id)

        if not self.codigo or self.codigo != codigo_ingresado:
            raise CodigoInvalido(codigo_ingresado)

        if self.codigo_expira_en and ahora > self.codigo_expira_en:
            raise CodigoInvalido(codigo_ingresado)  # expirado

        self.abordado          = True
        self.verificado_por_id = verificador_id
        self.rol_verificador   = rol
        self.verificado_en     = ahora

    # ── Consultas ─────────────────────────────────────────────────────────

    @property
    def tiene_codigo_activo(self) -> bool:
        """True si hay código generado y no ha expirado."""
        from datetime import timezone
        if not self.codigo or not self.codigo_expira_en:
            return False
        return datetime.now(tz=timezone.utc) < self.codigo_expira_en


@dataclass
class DocumentoEstudiante:
    """
    Documento personal del estudiante (EPS, póliza, consentimiento, etc.)
    que puede reutilizarse en múltiples salidas.

    Regla: un estudiante solo puede tener un documento por tipo.
    """
    id:               Optional[int]      = None
    estudiante_id:    Optional[int]      = None
    tipo:             Optional[TipoDocumento] = None
    archivo_url:      str                = ''
    estado:           EstadoDocumento    = EstadoDocumento.NO_CARGADO
    fecha_vencimiento: Optional[object]  = None   # date

    @property
    def esta_vigente(self) -> bool:
        return self.estado == EstadoDocumento.VIGENTE
