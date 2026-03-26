from modulos.Logistica.Parametro.dominio.Parametro import Parametro
from modulos.Logistica.Parametro.dominio.ParametroId import ParametroId
from modulos.Logistica.Parametro.dominio.ParametroClave import ParametroClave
from modulos.Logistica.Parametro.dominio.ParametroNombre import ParametroNombre
from modulos.Logistica.Parametro.dominio.ParametroValor import ParametroValor
from modulos.Logistica.Parametro.dominio.ParametroDescripcion import ParametroDescripcion
from modulos.Logistica.Parametro.dominio.ParametroCategoria import ParametroCategoria
from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository

class ParametroEdit:
    def __init__(self, repository: ParametroRepository):
        self.repository = repository

    def run(self, id_val: str, clave: str = None, nombre: str = None, valor: str = None, descripcion: str = None, categoria: str = None) -> dict:
        p_id = ParametroId(id_val)
        existente = self.repository.get_by_id(p_id)
        if not existente:
            raise ValueError(f"Parámetro con ID {id_val} no encontrado.")

        parametro = Parametro(
            id=existente.id,
            clave=ParametroClave(clave) if clave is not None else existente.clave,
            nombre=ParametroNombre(nombre) if nombre is not None else existente.nombre,
            valor=ParametroValor(valor) if valor is not None else existente.valor,
            descripcion=ParametroDescripcion(descripcion) if descripcion is not None else existente.descripcion,
            categoria=ParametroCategoria(categoria) if categoria is not None else existente.categoria
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
