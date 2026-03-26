from typing import List, Optional
from modulos.Salidas.Planeacion.dominio.PlaneacionRepository import PlaneacionRepository
from modulos.Salidas.Planeacion.dominio.Planeacion import Planeacion
from modulos.Salidas.Planeacion.dominio.PlaneacionId import PlaneacionId
from modulos.Salidas.Planeacion.dominio.PlaneacionSalidaId import PlaneacionSalidaId
from modulos.Salidas.Planeacion.dominio.PlaneacionCompetencias import PlaneacionCompetencias
from modulos.Salidas.Planeacion.dominio.PlaneacionResultados import PlaneacionResultados
from modulos.Salidas.Planeacion.dominio.PlaneacionGuion import PlaneacionGuion
from modulos.Salidas.Planeacion.dominio.PlaneacionRequiereGuia import PlaneacionRequiereGuia

try:
    from .models import PlaneacionModelo
except ImportError:
    PlaneacionModelo = None

class DjangoPlaneacionRepository(PlaneacionRepository):
    def _to_domain(self, model_obj) -> Planeacion:
        return Planeacion(
            id=PlaneacionId(model_obj.id),
            salida_id=PlaneacionSalidaId(model_obj.salida_id),
            competencias=PlaneacionCompetencias(model_obj.competencias),
            resultados=PlaneacionResultados(model_obj.resultados),
            guion=PlaneacionGuion(model_obj.guion),
            requiere_guia=PlaneacionRequiereGuia(model_obj.requiere_guia)
        )

    def save(self, planeacion: Planeacion) -> Planeacion:
        if not PlaneacionModelo:
            raise NotImplementedError("Modulo de modelos Django no instalado")
            
        defaults = {
            'salida_id': planeacion.salida_id.value,
            'competencias': planeacion.competencias.value,
            'resultados': planeacion.resultados.value,
            'guion': planeacion.guion.value,
            'requiere_guia': planeacion.requiere_guia.value,
        }
        if planeacion.id.value:
            obj, _ = PlaneacionModelo.objects.update_or_create(id=planeacion.id.value, defaults=defaults)
        else:
            obj = PlaneacionModelo.objects.create(**defaults)
        return self._to_domain(obj)

    def get_by_id(self, id_planeacion: int) -> Optional[Planeacion]:
        if not PlaneacionModelo: return None
        try:
            return self._to_domain(PlaneacionModelo.objects.get(id=id_planeacion))
        except Exception:
            return None

    def get_all(self) -> List[Planeacion]:
        if not PlaneacionModelo: return []
        return [self._to_domain(o) for o in PlaneacionModelo.objects.all()]

    def delete(self, id_planeacion: int) -> None:
        if PlaneacionModelo:
            PlaneacionModelo.objects.filter(id=id_planeacion).delete()
