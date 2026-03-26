import uuid
from modulos.Logistica.Parametro.dominio.Parametro import Parametro
from modulos.Logistica.Parametro.dominio.ParametroId import ParametroId
from modulos.Logistica.Parametro.dominio.ParametroClave import ParametroClave
from modulos.Logistica.Parametro.dominio.ParametroNombre import ParametroNombre
from modulos.Logistica.Parametro.dominio.ParametroValor import ParametroValor
from modulos.Logistica.Parametro.dominio.ParametroDescripcion import ParametroDescripcion
from modulos.Logistica.Parametro.dominio.ParametroCategoria import ParametroCategoria
from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository

class ParametroCreate:
    def __init__(self, repository: ParametroRepository):
        self.repository = repository

    def run(self, clave: str, nombre: str, valor: str, descripcion: str, categoria: str) -> dict:
        nuevo_id = ParametroId(str(uuid.uuid4()))
        parametro = Parametro(
            id=nuevo_id,
            clave=ParametroClave(clave),
            nombre=ParametroNombre(nombre),
            valor=ParametroValor(valor),
            descripcion=ParametroDescripcion(descripcion),
            categoria=ParametroCategoria(categoria)
        )
        guardado = self.repository.save(parametro)
        return {
            "id": guardado.id.value,
            "clave": guardado.clave.value,
            "nombre": guardado.nombre.value,
            "valor": guardado.valor.value,
            "descripcion": guardado.descripcion.value,
            "categoria": guardado.categoria.value
        }
