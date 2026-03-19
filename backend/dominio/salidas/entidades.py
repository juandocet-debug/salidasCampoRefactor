# dominio/salidas/entidades.py
# ─────────────────────────────────────────────────────────────────────────────
# ENTIDADES DE DOMINIO del slice Salidas
#
# ¿Qué es una Entidad?
# Objeto con identidad propia (tiene un ID) que encapsula la lógica de negocio.
# La lógica que CAMBIA EL ESTADO de la salida vive aquí — en ningún otro lugar.
#
# ⚠️  CERO imports de Django aquí. Python puro: dataclasses + typing.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import date, time
from typing import Optional

from .valor_objetos import EstadoSalida, ConceptoRevision, DecisionConsejo, ParametrosCosto
from .excepciones import TransicionNoPermitida, SalidaSinPermiso


@dataclass
class Salida:
    """
    Entidad raíz del sistema OTIUM.
    Todos los demás slices (abordaje, transporte, presupuesto) referencian a esta.

    La LÓGICA DE NEGOCIO que cambia el estado vive aquí:
        - enviar()
        - aprobar()
        - solicitar_cambios()
        - rechazar()
        - iniciar_ejecucion()
        - etc.
    """
    # ── Identidad ──────────────────────────────────────────────────────────
    id:     Optional[int] = None          # None hasta que persiste en BD
    codigo: str           = ''            # Auto-generado: SAL-2026-001

    # ── Datos básicos (Paso 1 del wizard) ─────────────────────────────────
    nombre:          str = ''
    asignatura:      str = ''
    semestre:        str = ''
    facultad:        str = ''
    programa:        str = ''
    num_estudiantes: int = 0
    justificacion:   str = ''

    # ── Estado y ciclo de vida ─────────────────────────────────────────────
    estado: EstadoSalida = EstadoSalida.BORRADOR

    # ── Actor propietario ──────────────────────────────────────────────────
    profesor_id: Optional[int] = None

    # ── Fechas y tiempos ──────────────────────────────────────────────────
    fecha_inicio: Optional[date] = None
    fecha_fin:    Optional[date] = None
    hora_inicio:  Optional[time] = None

    # ── Variables para cálculo de costos ──────────────────────────────────
    distancia_total_km: float = 0.0
    duracion_dias:      float = 1.0
    horas_viaje:        float = 9.0
    costo_estimado:     float = 0.0

    # ── Presentación visual ────────────────────────────────────────────────
    icono: str = 'IcoMap'
    color: str = '#4A8DAC'

    # ── Timestamps (los setea la infraestructura, no el dominio) ──────────
    created_at: Optional[object] = field(default=None, repr=False)
    updated_at: Optional[object] = field(default=None, repr=False)

    # ══════════════════════════════════════════════════════════════════════
    # COMPORTAMIENTO DE NEGOCIO
    # ══════════════════════════════════════════════════════════════════════

    def _validar_transicion(self, destino: EstadoSalida) -> None:
        """Lanza TransicionNoPermitida si el cambio de estado no está permitido."""
        permitidos = EstadoSalida._TRANSICIONES.get(self.estado, set())
        if destino not in permitidos:
            raise TransicionNoPermitida(self.estado, destino)

    # ── Acciones de ciclo de vida ──────────────────────────────────────────

    def enviar(self, solicitante_id: int) -> None:
        """
        El profesor envía la solicitud para revisión del Coordinador Académico.
        Solo el profesor dueño puede enviarla, y solo desde BORRADOR.
        """
        if solicitante_id != self.profesor_id:
            raise SalidaSinPermiso(solicitante_id, 'enviar solicitud')
        self._validar_transicion(EstadoSalida.ENVIADA)
        self.estado = EstadoSalida.ENVIADA

    def iniciar_revision(self) -> None:
        """El Coordinador Académico toma la solicitud para revisarla."""
        self._validar_transicion(EstadoSalida.EN_REVISION)
        self.estado = EstadoSalida.EN_REVISION

    def emitir_concepto_favorable(self) -> None:
        """El Coordinador emite concepto FAVORABLE — va al Consejo."""
        self._validar_transicion(EstadoSalida.FAVORABLE)
        self.estado = EstadoSalida.FAVORABLE

    def solicitar_cambios(self) -> None:
        """El Consejo solicita ajustes — el profesor debe corregir."""
        self._validar_transicion(EstadoSalida.PENDIENTE_AJUSTE)
        self.estado = EstadoSalida.PENDIENTE_AJUSTE

    def registrar_ajuste(self, solicitante_id: int) -> None:
        """El profesor responde a los cambios solicitados."""
        if solicitante_id != self.profesor_id:
            raise SalidaSinPermiso(solicitante_id, 'registrar ajuste')
        self._validar_transicion(EstadoSalida.AJUSTADA)
        self.estado = EstadoSalida.AJUSTADA

    def aprobar(self) -> None:
        """El Consejo de Facultad aprueba la solicitud."""
        self._validar_transicion(EstadoSalida.APROBADA)
        self.estado = EstadoSalida.APROBADA

    def rechazar(self) -> None:
        """El Consejo de Facultad rechaza la solicitud."""
        self._validar_transicion(EstadoSalida.RECHAZADA)
        self.estado = EstadoSalida.RECHAZADA

    def iniciar_preparacion(self) -> None:
        """El Coordinador de Salidas activa la fase operativa."""
        self._validar_transicion(EstadoSalida.EN_PREPARACION)
        self.estado = EstadoSalida.EN_PREPARACION

    def iniciar_ejecucion(self) -> None:
        """La salida comienza físicamente."""
        self._validar_transicion(EstadoSalida.EN_EJECUCION)
        self.estado = EstadoSalida.EN_EJECUCION

    def finalizar(self) -> None:
        """La salida termina — entra al cierre operativo."""
        self._validar_transicion(EstadoSalida.FINALIZADA)
        self.estado = EstadoSalida.FINALIZADA

    def cerrar(self) -> None:
        """Cierre definitivo — pasa al histórico."""
        self._validar_transicion(EstadoSalida.CERRADA)
        self.estado = EstadoSalida.CERRADA

    def cancelar(self) -> None:
        """Cancelación desde cualquier estado activo."""
        self._validar_transicion(EstadoSalida.CANCELADA)
        self.estado = EstadoSalida.CANCELADA

    # ── Lógica de negocio: cálculo de costos ─────────────────────────────

    def calcular_costo_estimado(self, params: ParametrosCosto) -> dict:
        """
        Aplica la fórmula oficial de costos y actualiza self.costo_estimado.

        Fórmula:
            C_total = combustible + hospedaje + horas_extra

        Donde:
            combustible  = (DT / R) * Pg
            hospedaje    = max(0.5, D - 0.5) * C_noche
            horas_extra  = max(0, Ht - 9*D) * C_hora

        Retorna el desglose completo para mostrar en la UI.
        """
        dt   = self.distancia_total_km
        r    = params.rendimiento_km_gal
        pg   = params.precio_galon
        d    = self.duracion_dias
        ht   = self.horas_viaje
        c_n  = params.costo_noche
        c_h  = params.costo_hora_extra

        combustible  = (dt / r) * pg
        hospedaje    = max(0.5, d - 0.5) * c_n
        horas_extra  = max(0.0, ht - 9 * d) * c_h
        total        = combustible + hospedaje + horas_extra

        self.costo_estimado = total

        return {
            'total':       round(total, 2),
            'combustible': round(combustible, 2),
            'hospedaje':   round(hospedaje, 2),
            'horas_extra': round(horas_extra, 2),
        }

    # ── Consultas ─────────────────────────────────────────────────────────

    @property
    def puede_editarse(self) -> bool:
        """Solo las salidas en estado borrador pueden ser editadas por el profesor."""
        return self.estado == EstadoSalida.BORRADOR

    @property
    def puede_eliminarse(self) -> bool:
        """Solo las salidas en estado borrador pueden ser eliminadas."""
        return self.estado == EstadoSalida.BORRADOR

    @property
    def esta_activa(self) -> bool:
        """True si la salida está en alguna fase activa (no terminada/cancelada)."""
        terminados = {EstadoSalida.CERRADA, EstadoSalida.CANCELADA, EstadoSalida.RECHAZADA}
        return self.estado not in terminados

    @property
    def en_ejecucion(self) -> bool:
        return self.estado == EstadoSalida.EN_EJECUCION

    def __str__(self) -> str:
        return f'{self.codigo} — {self.nombre} [{self.estado}]'
