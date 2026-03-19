# aplicacion/salidas/casos_uso/enviar_solicitud.py
# HU-PROF-005 — Al enviar: estado → "Enviada", notifica al coordinador.

from dataclasses import dataclass
from dominio.salidas.entidades import Salida
from aplicacion.salidas.puertos.repositorio import ISalidaRepositorio


@dataclass
class EnviarSolicitudComando:
    salida_id:      int
    solicitante_id: int   # Debe ser el profesor dueño


class EnviarSolicitudCasoUso:
    """
    Mueve la salida de BORRADOR → ENVIADA.
    La validación de que el solicitante sea el profesor dueño
    vive en la entidad Salida.enviar() — no aquí.
    """

    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, comando: EnviarSolicitudComando) -> Salida:
        salida = self._repo.obtener_por_id(comando.salida_id)
        salida.enviar(comando.solicitante_id)  # Lanza excepción si no puede
        return self._repo.guardar(salida)
