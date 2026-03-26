import uuid
from modulos.Logistica.Parametro.dominio.ParametroId import ParametroId
from modulos.Logistica.Parametro.dominio.ParametroClave import ParametroClave
from modulos.Logistica.Parametro.dominio.ParametroNombre import ParametroNombre
from modulos.Logistica.Parametro.dominio.ParametroValor import ParametroValor
from modulos.Logistica.Parametro.dominio.ParametroDescripcion import ParametroDescripcion
from modulos.Logistica.Parametro.dominio.ParametroCategoria import ParametroCategoria
from modulos.Logistica.Parametro.dominio.Parametro import Parametro
from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository

class ParametroUpdateConfiguracion:
    def __init__(self, repository: ParametroRepository):
        self.repository = repository

    def run(self, datos: dict) -> dict:
        todos = self.repository.get_all()
        mapa_existentes = { p.clave.value: p for p in todos }
        
        for clave, valor_crudo in datos.items():
            valor_str = str(valor_crudo)
            
            if clave in mapa_existentes:
                # Modificar el existente
                existente = mapa_existentes[clave]
                actualizado = Parametro(
                    id=existente.id,
                    clave=existente.clave,
                    nombre=existente.nombre,
                    valor=ParametroValor(valor_str),
                    descripcion=existente.descripcion,
                    categoria=existente.categoria
                )
                self.repository.save(actualizado)
            else:
                # Generar nuevo
                nuevo_id = ParametroId(str(uuid.uuid4()))
                nombre_calculado = clave.replace('_', ' ').title()
                nuevo = Parametro(
                    id=nuevo_id,
                    clave=ParametroClave(clave),
                    nombre=ParametroNombre(nombre_calculado),
                    valor=ParametroValor(valor_str),
                    descripcion=ParametroDescripcion("Configuración autogenerada"),
                    categoria=ParametroCategoria("Global")
                )
                self.repository.save(nuevo)
                
        # Devolver el nuevo consolidado formateado
        actualizados = self.repository.get_all()
        respuesta = {}
        for p in actualizados:
            try:
                respuesta[p.clave.value] = float(p.valor.value)
            except (ValueError, TypeError):
                respuesta[p.clave.value] = p.valor.value
        return respuesta
