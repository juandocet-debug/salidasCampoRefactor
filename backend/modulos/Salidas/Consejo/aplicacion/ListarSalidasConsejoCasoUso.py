# backend/modulos/Salidas/Consejo/aplicacion/ListarSalidasConsejoCasoUso.py
"""
Caso de Uso: Listar las salidas que están listas para la aprobación del Consejo de Facultad.
El Consejo solo ve salidas en estado FAVORABLE (validadas por el Coordinador),
más las que ya tienen decisión del Consejo (APROBADA / RECHAZADA) para historial.
"""
from typing import List

from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.SalidaMetadataRepository import SalidaMetadataRepository
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida
from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogicaRepository import RevisionPedagogicaRepository
from modulos.Salidas.Consejo.dominio.ConsejoRepository import ConsejoRepository
from .SalidaConsejoDTO import SalidaConsejoDTO, RevisionCoordinadorDTO, DecisionConsejoDTO


class ListarSalidasConsejoCasoUso:
    """
    Caso de Uso (Hexagonal puro): Obtiene la lista de salidas validadas
    por el Coordinador que están pendientes de aprobación o ya fueron
    procesadas por el Consejo de Facultad.
    """

    def __init__(
        self,
        salida_repo: SalidaRepository,
        revision_repo: RevisionPedagogicaRepository,
        consejo_repo: ConsejoRepository,
        metadata_repo: SalidaMetadataRepository,
    ):
        self.salida_repo = salida_repo
        self.revision_repo = revision_repo
        self.consejo_repo = consejo_repo
        self.metadata_repo = metadata_repo

    def ejecutar(self) -> List[SalidaConsejoDTO]:
        todas = self.salida_repo.get_all()

        estados_consejo = [
            EstadoSalida.FAVORABLE,
            EstadoSalida.APROBADA,
            EstadoSalida.RECHAZADA,
            EstadoSalida.PENDIENTE_AJUSTE,
            EstadoSalida.EN_PREPARACION,
            EstadoSalida.LISTA_EJECUCION,
            EstadoSalida.EN_EJECUCION,
            EstadoSalida.FINALIZADA,
            EstadoSalida.CERRADA,
            EstadoSalida.CANCELADA,
        ]
        salidas_consejo = [s for s in todas if s.estado in estados_consejo]

        resultado = []
        for s in salidas_consejo:
            meta = self.metadata_repo.obtener_metadata(s.id.value)

            # Obtener revisión del Coordinador
            revision_coord = self.revision_repo.obtener_por_salida(SalidaId(s.id.value))
            revision_dto = None
            if revision_coord:
                revision_dto = RevisionCoordinadorDTO(
                    concepto_final=revision_coord.concepto_final.value,
                    pertinencia_estado=revision_coord.pertinencia.estado.value,
                    pertinencia_obs=revision_coord.pertinencia.observacion,
                    objetivos_estado=revision_coord.objetivos.estado.value,
                    objetivos_obs=revision_coord.objetivos.observacion,
                    metodologia_estado=revision_coord.metodologia.estado.value,
                    metodologia_obs=revision_coord.metodologia.observacion,
                    viabilidad_estado=revision_coord.viabilidad.estado.value,
                    viabilidad_obs=revision_coord.viabilidad.observacion,
                    fecha=str(revision_coord.fecha_revision) if revision_coord.fecha_revision else None,
                )

            # Obtener decisión previa del Consejo (si existe)
            decision = self.consejo_repo.obtener_por_salida(s.id.value)
            decision_dto = None
            if decision:
                decision_dto = DecisionConsejoDTO(
                    concepto_financiero=decision.concepto_financiero,
                    observaciones=decision.observaciones,
                    acta=decision.acta,
                    fecha_acta=str(decision.fecha_acta) if decision.fecha_acta else None,
                    fecha_decision=str(decision.fecha_decision) if decision.fecha_decision else None,
                )

            resultado.append(SalidaConsejoDTO(
                id=s.id.value,
                nombre=s.nombre.value,
                estado=s.estado.value,
                codigo=s.codigo.value,
                asignatura=s.asignatura.value if s.asignatura else '',
                destino=meta.get('destino', 'Sin destino definido'),
                semestre=s.semestre.value if s.semestre else '',
                profesor_id=s.profesor_id.value if s.profesor_id else None,
                fecha_inicio=str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
                fecha_fin=str(s.fecha_fin.value) if s.fecha_fin and s.fecha_fin.value else None,
                num_estudiantes=s.num_estudiantes.value if s.num_estudiantes else 0,
                programa_id=s.programa_id.value if s.programa_id else None,
                justificacion=s.justificacion.value if s.justificacion else '',
                costo_estimado=float(s.costo_estimado.value or 0) if hasattr(s, 'costo_estimado') and s.costo_estimado else 0,
                objetivo_general=meta.get('objetivo_general', ''),
                revision_coordinador=revision_dto,
                decision_consejo=decision_dto,
            ))

        return resultado
