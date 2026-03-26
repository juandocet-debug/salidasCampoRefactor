from modulos.Logistica.Parametro.dominio.Parametro import Parametro
from modulos.Logistica.Parametro.dominio.ParametroId import ParametroId
from modulos.Logistica.Parametro.dominio.ParametroClave import ParametroClave
from modulos.Logistica.Parametro.dominio.ParametroNombre import ParametroNombre
from modulos.Logistica.Parametro.dominio.ParametroValor import ParametroValor
from modulos.Logistica.Parametro.dominio.ParametroDescripcion import ParametroDescripcion
from modulos.Logistica.Parametro.dominio.ParametroCategoria import ParametroCategoria
from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository
from .models import ParametroModel
from typing import List, Optional

class DjangoParametroRepository(ParametroRepository):
    
    def _to_domain(self, model: ParametroModel) -> Parametro:
        return Parametro(
            id=ParametroId(str(model.id)),
            clave=ParametroClave(model.clave),
            nombre=ParametroNombre(model.nombre),
            valor=ParametroValor(model.valor),
            descripcion=ParametroDescripcion(model.descripcion),
            categoria=ParametroCategoria(model.categoria)
        )

    def save(self, parametro: Parametro) -> Parametro:
        obj, created = ParametroModel.objects.update_or_create(
            id=parametro.id.value,
            defaults={
                'clave': parametro.clave.value,
                'nombre': parametro.nombre.value,
                'valor': parametro.valor.value,
                'descripcion': parametro.descripcion.value,
                'categoria': parametro.categoria.value
            }
        )
        return self._to_domain(obj)

    def get_all(self, filtros: dict = None) -> List[Parametro]:
        qs = ParametroModel.objects.all()
        if filtros:
            if 'categoria' in filtros:
                qs = qs.filter(categoria=filtros['categoria'])
            if 'clave' in filtros:
                qs = qs.filter(clave=filtros['clave'])
        return [self._to_domain(p) for p in qs]

    def get_by_id(self, parametro_id: ParametroId) -> Optional[Parametro]:
        try:
            model = ParametroModel.objects.get(id=parametro_id.value)
            return self._to_domain(model)
        except ParametroModel.DoesNotExist:
            return None

    def delete(self, parametro_id: ParametroId) -> None:
        ParametroModel.objects.filter(id=parametro_id.value).delete()
