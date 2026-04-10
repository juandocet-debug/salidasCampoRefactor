from typing import Optional
from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Usuarios.dominio.UsuarioId import UsuarioId
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogica import RevisionPedagogica
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogicaId import RevisionPedagogicaId
from modulos.Salidas.Coordinacion.dominio.CriterioEvaluacion import CriterioEvaluacion, EstadoCriterio
from modulos.Salidas.Coordinacion.dominio.ConceptoFinal import ConceptoFinal
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogicaRepository import RevisionPedagogicaRepository
from .models import RevisionPedagogicaModel

class DjangoRevisionPedagogicaRepository(RevisionPedagogicaRepository):
    def guardar(self, revision: RevisionPedagogica) -> RevisionPedagogica:
        modelo, _ = RevisionPedagogicaModel.objects.update_or_create(
            salida_id=revision.salida_id.value,
            defaults={
                'coordinador_id': revision.coordinador_id.value,
                'pertinencia_estado': revision.pertinencia.estado.value,
                'pertinencia_obs': revision.pertinencia.observacion,
                'objetivos_estado': revision.objetivos.estado.value,
                'objetivos_obs': revision.objetivos.observacion,
                'metodologia_estado': revision.metodologia.estado.value,
                'metodologia_obs': revision.metodologia.observacion,
                'viabilidad_estado': revision.viabilidad.estado.value,
                'viabilidad_obs': revision.viabilidad.observacion,
                'concepto_final': revision.concepto_final.value,
            }
        )
        return revision

    def obtener_por_salida(self, salida_id: SalidaId) -> Optional[RevisionPedagogica]:
        try:
            modelo = RevisionPedagogicaModel.objects.get(salida_id=salida_id.value)
            return RevisionPedagogica(
                id=RevisionPedagogicaId(modelo.id),
                salida_id=SalidaId(modelo.salida_id),
                coordinador_id=UsuarioId(modelo.coordinador_id),
                pertinencia=CriterioEvaluacion(EstadoCriterio(modelo.pertinencia_estado), modelo.pertinencia_obs),
                objetivos=CriterioEvaluacion(EstadoCriterio(modelo.objetivos_estado), modelo.objetivos_obs),
                metodologia=CriterioEvaluacion(EstadoCriterio(modelo.metodologia_estado), modelo.metodologia_obs),
                viabilidad=CriterioEvaluacion(EstadoCriterio(modelo.viabilidad_estado), modelo.viabilidad_obs),
                concepto_final=ConceptoFinal(modelo.concepto_final),
                fecha_revision=modelo.fecha_revision
            )
        except RevisionPedagogicaModel.DoesNotExist:
            return None
