# CAPA: Dominio
# QUÉ HACE: Define la entidad Salida con su lógica de negocio (cambios de estado, costos, permisos)
# NO DEBE CONTENER: imports de Django, ORM, serializadores, lógica de vistas

from __future__ import annotations
from dataclasses import dataclass, field
from datetime import date, time
from typing import Optional

from dominio.salidas.valor_objetos import EstadoSalida, TRANSICIONES
from dominio.salidas.excepciones import TransicionNoPermitida, SalidaSinPermiso


@dataclass
class Salida:
    # ── Identidad ─────────────────────────────────────────────────────────
    id:     Optional[int] = None
    codigo: str           = ''

    # ── Datos básicos ─────────────────────────────────────────────────────
    nombre:          str = ''
    asignatura:      str = ''
    semestre:        str = ''
    facultad:        str = ''
    programa:        str = ''
    num_estudiantes: int = 0
    justificacion:   str = ''

    # ── Estado y propietario ──────────────────────────────────────────────
    estado:      EstadoSalida = EstadoSalida.BORRADOR
    profesor_id: Optional[int] = None

    # ── Fechas ────────────────────────────────────────────────────────────
    fecha_inicio: Optional[date] = None
    fecha_fin:    Optional[date] = None
    hora_inicio:  Optional[time] = None

    # ── Costos ────────────────────────────────────────────────────────────
    distancia_total_km: float = 0.0
    duracion_dias:      float = 1.0
    horas_viaje:        float = 9.0
    costo_estimado:     float = 0.0

    # ── Presentación ──────────────────────────────────────────────────────
    icono: str = 'IcoMap'
    color: str = '#4A8DAC'

    # ── Campos anidados sueltos recuperados ───────────────────────────────
    resumen: str = ''
    relacion_syllabus: str = ''
    productos_esperados: str = ''
    objetivo_general: str = ''
    objetivos_especificos: str = ''
    estrategia_metodologica: str = ''
    punto_partida: str = ''
    parada_max: str = ''
    criterio_evaluacion_texto: str = ''
    puntos_ruta_data: list = field(default_factory=list)
    puntos_retorno_data: list = field(default_factory=list)

    # ── Timestamps (los setea la infraestructura) ─────────────────────────
    created_at: Optional[object] = field(default=None, repr=False)
    updated_at: Optional[object] = field(default=None, repr=False)

    # ══════════════════════════════════════════════════════════════════════
    # REGLAS DE NEGOCIO
    # ══════════════════════════════════════════════════════════════════════

    def _validar_transicion(self, destino: EstadoSalida) -> None:
        permitidos = TRANSICIONES.get(self.estado, set())
        if destino not in permitidos:
            raise TransicionNoPermitida(self.estado, destino)

    # ── Consultas de estado ───────────────────────────────────────────────

    @property
    def puede_editarse(self) -> bool:
        return self.estado == EstadoSalida.BORRADOR

    @property
    def puede_eliminarse(self) -> bool:
        return self.estado == EstadoSalida.BORRADOR

    @property
    def esta_activa(self) -> bool:
        terminados = {EstadoSalida.CERRADA, EstadoSalida.CANCELADA, EstadoSalida.RECHAZADA}
        return self.estado not in terminados

    def verificar_acceso(self, profesor_id: int) -> None:
        if self.profesor_id != profesor_id:
            raise SalidaSinPermiso(profesor_id, 'acceder a esta salida')

    # ── Acciones de ciclo de vida ─────────────────────────────────────────

    def enviar(self, solicitante_id: int) -> None:
        if solicitante_id != self.profesor_id:
            raise SalidaSinPermiso(solicitante_id, 'enviar solicitud')
        self._validar_transicion(EstadoSalida.ENVIADA)
        self.estado = EstadoSalida.ENVIADA

    def iniciar_revision(self) -> None:
        self._validar_transicion(EstadoSalida.EN_REVISION)
        self.estado = EstadoSalida.EN_REVISION

    def emitir_concepto_favorable(self) -> None:
        self._validar_transicion(EstadoSalida.FAVORABLE)
        self.estado = EstadoSalida.FAVORABLE

    def solicitar_cambios(self) -> None:
        self._validar_transicion(EstadoSalida.PENDIENTE_AJUSTE)
        self.estado = EstadoSalida.PENDIENTE_AJUSTE

    def registrar_ajuste(self, solicitante_id: int) -> None:
        if solicitante_id != self.profesor_id:
            raise SalidaSinPermiso(solicitante_id, 'registrar ajuste')
        self._validar_transicion(EstadoSalida.AJUSTADA)
        self.estado = EstadoSalida.AJUSTADA

    def aprobar(self) -> None:
        self._validar_transicion(EstadoSalida.APROBADA)
        self.estado = EstadoSalida.APROBADA

    def rechazar(self) -> None:
        self._validar_transicion(EstadoSalida.RECHAZADA)
        self.estado = EstadoSalida.RECHAZADA

    def iniciar_preparacion(self) -> None:
        self._validar_transicion(EstadoSalida.EN_PREPARACION)
        self.estado = EstadoSalida.EN_PREPARACION

    def iniciar_ejecucion(self) -> None:
        self._validar_transicion(EstadoSalida.EN_EJECUCION)
        self.estado = EstadoSalida.EN_EJECUCION

    def finalizar(self) -> None:
        self._validar_transicion(EstadoSalida.FINALIZADA)
        self.estado = EstadoSalida.FINALIZADA

    def cerrar(self) -> None:
        self._validar_transicion(EstadoSalida.CERRADA)
        self.estado = EstadoSalida.CERRADA

    def cancelar(self) -> None:
        self._validar_transicion(EstadoSalida.CANCELADA)
        self.estado = EstadoSalida.CANCELADA

    # ── Cálculo de costos ─────────────────────────────────────────────────

    def calcular_costo(self, rendimiento_km_gal: float, precio_galon: float,
                       costo_noche: float, costo_hora_extra: float) -> dict:
        combustible = (self.distancia_total_km / rendimiento_km_gal) * precio_galon
        hospedaje   = max(0.5, self.duracion_dias - 0.5) * costo_noche
        horas_extra = max(0.0, self.horas_viaje - 9 * self.duracion_dias) * costo_hora_extra
        total       = combustible + hospedaje + horas_extra

        self.costo_estimado = total

        return {
            'total':       round(total, 2),
            'combustible': round(combustible, 2),
            'hospedaje':   round(hospedaje, 2),
            'horas_extra': round(horas_extra, 2),
        }

    def __str__(self) -> str:
        return f'{self.codigo} — {self.nombre} [{self.estado}]'
