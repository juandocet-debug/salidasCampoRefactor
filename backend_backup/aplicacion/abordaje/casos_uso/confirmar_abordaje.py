# aplicacion/abordaje/casos_uso/confirmar_abordaje.py
# ─────────────────────────────────────────────────────────────────────────────
# CASOS DE USO: Generación y verificación del código de abordaje
# Cubre: HU-EST-006 (generar código) + HU-COND-005 / HU-PROF-010 (verificar)
# ─────────────────────────────────────────────────────────────────────────────

import secrets
import string
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from dominio.abordaje.entidades import RegistroAbordaje
from dominio.abordaje.valor_objetos import RolVerificador
from aplicacion.abordaje.puertos.repositorio import IAbordajeRepositorio


# ── CASO DE USO 1: Estudiante activa su código ────────────────────────────────

@dataclass
class ActivarCodigoComando:
    salida_id:     int
    estudiante_id: int
    foto_url:      str   # La foto ya debe estar subida


class ActivarCodigoCasoUso:
    """
    El estudiante genera su código alfanumérico de 6 caracteres.

    Regla (RF-009.1): La foto es OBLIGATORIA antes de generar el código.
    Regla (RF-009.3): El código expira al finalizar el día de la salida.
    """
    LONGITUD_CODIGO    = 6
    HORAS_VIGENCIA     = 24   # Activo todo el día de la salida

    def __init__(self, repositorio: IAbordajeRepositorio):
        self._repo = repositorio

    def ejecutar(self, cmd: ActivarCodigoComando) -> RegistroAbordaje:
        registro = self._repo.obtener(cmd.salida_id, cmd.estudiante_id)

        # Actualizar foto antes de activar
        registro.foto_url = cmd.foto_url

        # Generar código seguro (solo letras mayúsculas + dígitos)
        alfabeto = string.ascii_uppercase + string.digits
        codigo   = ''.join(secrets.choice(alfabeto) for _ in range(self.LONGITUD_CODIGO))
        expira   = datetime.now(tz=timezone.utc) + timedelta(hours=self.HORAS_VIGENCIA)

        registro.activar_codigo(codigo, expira)   # La entidad valida la foto
        return self._repo.guardar(registro)


# ── CASO DE USO 2: Conductor o Profesor confirman el abordaje ─────────────────

@dataclass
class ConfirmarAbordajeComando:
    salida_id:       int
    codigo:          str    # 6 caracteres ingresados en el modal
    verificador_id:  int
    rol_verificador: RolVerificador


class ConfirmarAbordajeCasoUso:
    """
    Conductor o Profesor ingresan el código para confirmar que el estudiante abordó.

    Flujo (RF-009.4 → RF-009.7):
      1. Se busca el registro por salida + código.
      2. La entidad valida el código y la expiración.
      3. Se marca como ABORDADO con quién verificó y cuándo.
      4. El repositorio devuelve el registro actualizado (con foto + nombre para mostrar en UI).
    """

    def __init__(self, repositorio: IAbordajeRepositorio):
        self._repo = repositorio

    def ejecutar(self, cmd: ConfirmarAbordajeComando) -> RegistroAbordaje:
        registro = self._repo.obtener_por_codigo(cmd.salida_id, cmd.codigo)
        ahora    = datetime.now(tz=timezone.utc)

        registro.confirmar_abordaje(
            codigo_ingresado=cmd.codigo,
            ahora=ahora,
            verificador_id=cmd.verificador_id,
            rol=cmd.rol_verificador,
        )
        return self._repo.guardar(registro)


# ── CASO DE USO 3: Consulta del estado de abordaje ───────────────────────────

class ObtenerListaAbordajeCasoUso:
    """
    Retorna todos los registros de abordaje de una salida
    para la vista del Conductor, Profesor y Coordinador.
    """

    def __init__(self, repositorio: IAbordajeRepositorio):
        self._repo = repositorio

    def ejecutar(self, salida_id: int) -> dict:
        registros = self._repo.listar_por_salida(salida_id)
        abordados = self._repo.contar_abordados(salida_id)
        return {
            'registros':  registros,
            'total':      len(registros),
            'abordados':  abordados,
            'pendientes': len(registros) - abordados,
        }
