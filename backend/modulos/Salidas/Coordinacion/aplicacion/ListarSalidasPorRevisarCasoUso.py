from typing import List
from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.SalidaMetadataRepository import SalidaMetadataRepository
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogicaRepository import RevisionPedagogicaRepository
from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from .SalidaCoordinacionDTO import SalidaCoordinacionDTO, RevisionDTO, CriterioDTO


class ListarSalidasPorRevisarCasoUso:
    """
    Caso de Uso (Hexagonal puro): Obtiene la lista de salidas que están a la espera
    de la revisión pedagógica del Coordinador Académico.
    Orquesta los tres puertos inyectados y devuelve DTOs listos para serializar.
    """
    def __init__(
        self,
        salida_repo: SalidaRepository,
        revision_repo: RevisionPedagogicaRepository,
        metadata_repo: SalidaMetadataRepository,
    ):
        self.salida_repo = salida_repo
        self.revision_repo = revision_repo
        self.metadata_repo = metadata_repo

    def ejecutar(self) -> List[SalidaCoordinacionDTO]:
        todas = self.salida_repo.get_all()
        estados_pendientes = [
            EstadoSalida.ENVIADA,
            EstadoSalida.EN_REVISION,
            EstadoSalida.PENDIENTE_AJUSTE,
            EstadoSalida.RECHAZADA,
        ]
        por_revisar = [s for s in todas if s.estado in estados_pendientes]

        resultado = []
        for s in por_revisar:
            meta = self.metadata_repo.obtener_metadata(s.id.value)
            revision_dominio = self.revision_repo.obtener_por_salida(SalidaId(s.id.value))

            revision_dto = None
            if revision_dominio:
                revision_dto = RevisionDTO(
                    concepto_final=revision_dominio.concepto_final.value,
                    pertinencia=CriterioDTO(
                        estado=revision_dominio.pertinencia.estado.value,
                        observacion=revision_dominio.pertinencia.observacion,
                    ),
                    objetivos=CriterioDTO(
                        estado=revision_dominio.objetivos.estado.value,
                        observacion=revision_dominio.objetivos.observacion,
                    ),
                    metodologia=CriterioDTO(
                        estado=revision_dominio.metodologia.estado.value,
                        observacion=revision_dominio.metodologia.observacion,
                    ),
                    viabilidad=CriterioDTO(
                        estado=revision_dominio.viabilidad.estado.value,
                        observacion=revision_dominio.viabilidad.observacion,
                    ),
                    fecha=str(revision_dominio.fecha_revision) if revision_dominio.fecha_revision else None,
                )

            resultado.append(SalidaCoordinacionDTO(
                id=s.id.value,
                nombre=s.nombre.value,
                estado=s.estado.value,
                codigo=s.codigo.value,
                asignatura=s.asignatura.value if s.asignatura else '',
                destino=meta.get('destino', 'Sin destino definido'),
                semestre=s.semestre.value if s.semestre else '',
                profesor_id=s.profesor_id.value if s.profesor_id else None,
                profesor_nombre=None,
                fecha_inicio=str(s.fecha_inicio.value) if s.fecha_inicio and s.fecha_inicio.value else None,
                fecha_fin=str(s.fecha_fin.value) if s.fecha_fin and s.fecha_fin.value else None,
                num_estudiantes=s.num_estudiantes.value if s.num_estudiantes else 0,
                programa_id=s.programa_id.value if s.programa_id else None,
                justificacion=s.justificacion.value if s.justificacion else '',
                costo_estimado=float(s.costo_estimado.value or 0) if hasattr(s, 'costo_estimado') and s.costo_estimado else 0,
                resumen=meta.get('resumen', ''),
                objetivo_general=meta.get('objetivo_general', ''),
                ultima_revision=revision_dto,
            ))

        return resultado

