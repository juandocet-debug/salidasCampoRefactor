# aplicacion/salidas/casos_uso/crear_salida.py
# ─────────────────────────────────────────────────────────────────────────────
# CASO DE USO: Crear Salida (Borrador)
# Corresponde a: HU-PROF-002 (Paso 1 del wizard)
# ─────────────────────────────────────────────────────────────────────────────

from dataclasses import dataclass

from dominio.salidas.entidades import Salida
from aplicacion.salidas.puertos.repositorio import ISalidaRepositorio


@dataclass
class CrearSalidaComando:
    """Datos de entrada que el controlador HTTP envía al caso de uso."""
    profesor_id:     int
    nombre:          str
    asignatura:      str
    semestre:        str
    facultad:        str
    programa:        str
    num_estudiantes: int
    justificacion:   str


class CrearSalidaCasoUso:
    """
    Crea una nueva salida en estado BORRADOR.

    Reglas de negocio:
    - Solo un profesor puede crear una salida (el rol lo valida el adaptador JWT).
    - Nace en estado BORRADOR — no está disponible para revisión.
    - No tiene codigo aún — lo asigna el repositorio en el INSERT.
    """

    def __init__(self, repositorio: ISalidaRepositorio):
        self._repo = repositorio

    def ejecutar(self, comando: CrearSalidaComando) -> Salida:
        nueva_salida = Salida(
            profesor_id=     comando.profesor_id,
            nombre=          comando.nombre,
            asignatura=      comando.asignatura,
            semestre=        comando.semestre,
            facultad=        comando.facultad,
            programa=        comando.programa,
            num_estudiantes= comando.num_estudiantes,
            justificacion=   comando.justificacion,
        )
        return self._repo.guardar(nueva_salida)
