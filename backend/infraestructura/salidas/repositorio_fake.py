# infraestructura/salidas/repositorio_fake.py
# ─────────────────────────────────────────────────────────────────────────────
# FAKE REPOSITORIO — Para tests unitarios
#
# Implementa ISalidaRepositorio con un simple dict en memoria.
# Los tests de casos de uso usan este fake, NO la BD real.
# Esto hace los tests ultrarrápidos y sin efectos secundarios.
#
# Ejemplo de uso en tests:
#
#   def test_enviar_solicitud_cambia_estado():
#       repo = FakeSalidaRepositorio()
#       salida = Salida(id=1, profesor_id=42, nombre='Eco 101')
#       repo.guardar(salida)
#
#       caso_uso = EnviarSolicitudCasoUso(repo)
#       resultado = caso_uso.ejecutar(EnviarSolicitudComando(salida_id=1, solicitante_id=42))
#
#       assert resultado.estado == EstadoSalida.ENVIADA
# ─────────────────────────────────────────────────────────────────────────────

from dominio.salidas.entidades import Salida
from dominio.salidas.valor_objetos import EstadoSalida
from dominio.salidas.excepciones import SalidaNoEncontrada
from aplicacion.salidas.puertos.repositorio import ISalidaRepositorio


class FakeSalidaRepositorio(ISalidaRepositorio):
    """
    Repositorio en memoria para tests.
    NO usar en producción.
    """

    def __init__(self):
        self._store: dict[int, Salida] = {}
        self._siguiente_id = 1

    def guardar(self, salida: Salida) -> Salida:
        if salida.id is None:
            salida.id = self._siguiente_id
            self._siguiente_id += 1
            salida.codigo = f'SAL-FAKE-{salida.id:03d}'
        self._store[salida.id] = salida
        return salida

    def obtener_por_id(self, salida_id: int) -> Salida:
        if salida_id not in self._store:
            raise SalidaNoEncontrada(salida_id)
        return self._store[salida_id]

    def obtener_por_codigo(self, codigo: str) -> Salida:
        for salida in self._store.values():
            if salida.codigo == codigo:
                return salida
        raise SalidaNoEncontrada(codigo)

    def listar_por_profesor(self, profesor_id: int) -> list[Salida]:
        return [s for s in self._store.values() if s.profesor_id == profesor_id]

    def listar_por_estado(self, estado: EstadoSalida) -> list[Salida]:
        return [s for s in self._store.values() if s.estado == estado]

    def listar_activas(self) -> list[Salida]:
        terminados = {EstadoSalida.CERRADA, EstadoSalida.CANCELADA, EstadoSalida.RECHAZADA}
        return [s for s in self._store.values() if s.estado not in terminados]
