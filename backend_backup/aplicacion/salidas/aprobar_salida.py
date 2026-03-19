# aplicacion/salidas/casos_uso/cambiar_estado.py
# ─────────────────────────────────────────────────────────────────────────────
# CASOS DE USO: Transiciones de estado post-revisión
# Cubre: revisión pedagógica, decisión del consejo, fases operativas.
# ─────────────────────────────────────────────────────────────────────────────

from dataclasses import dataclass
from dominio.salidas.entidades import Salida
from aplicacion.salidas.puertos.repositorio import ISalidaRepositorio


# ── Revisión Coordinador Académico ────────────────────────────────────────────

class IniciarRevisionCasoUso:
    """Coordinador Académico toma la solicitud → EN_REVISION."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.iniciar_revision()
        return self._repo.guardar(salida)


class EmitirConceptoFavorableCasoUso:
    """Coordinador emite FAVORABLE → va al Consejo."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.emitir_concepto_favorable()
        return self._repo.guardar(salida)


# ── Decisión del Consejo de Facultad ─────────────────────────────────────────

class AprobarSalidaCasoUso:
    """Consejo aprueba → APROBADA."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.aprobar()
        return self._repo.guardar(salida)


class SolicitarCambiosCasoUso:
    """Consejo solicita cambios → PENDIENTE_AJUSTE."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.solicitar_cambios()
        return self._repo.guardar(salida)


class RechazarSalidaCasoUso:
    """Consejo rechaza → RECHAZADA."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.rechazar()
        return self._repo.guardar(salida)


# ── Fases operativas (Coordinador de Salidas) ─────────────────────────────────

class IniciarEjecucionCasoUso:
    """La salida sale físicamente → EN_EJECUCION."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.iniciar_ejecucion()
        return self._repo.guardar(salida)


class FinalizarSalidaCasoUso:
    """La salida regresa → FINALIZADA."""
    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> Salida:
        salida = self._repo.obtener_por_id(salida_id)
        salida.finalizar()
        return self._repo.guardar(salida)
