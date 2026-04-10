from typing import Dict, Any

from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Usuarios.dominio.UsuarioId import UsuarioId
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogica import RevisionPedagogica
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogicaId import RevisionPedagogicaId
from modulos.Salidas.Coordinacion.dominio.CriterioEvaluacion import CriterioEvaluacion, EstadoCriterio
from modulos.Salidas.Coordinacion.dominio.ConceptoFinal import ConceptoFinal
from modulos.Salidas.Coordinacion.dominio.RevisionPedagogicaRepository import RevisionPedagogicaRepository

# Dependencias hacia Salidas Core
from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida


class RegistrarRevisionCasoUso:
    """
    Caso de Uso: El Coordinador registra su revisión pedagógica.
    Valida las reglas de negocio basadas en los criterios 
    y actualiza el estado general de la Salida de campo.
    """
    def __init__(self, revision_repo: RevisionPedagogicaRepository, salida_repo: SalidaRepository):
        self.revision_repo = revision_repo
        self.salida_repo = salida_repo

    def ejecutar(self, salida_id: int, coordinador_id: int, datos_revision: Dict[str, Any]):
        # Parsear Concepto Final
        concepto_str = datos_revision.get('concepto_final')
        try:
            concepto = ConceptoFinal(concepto_str)
        except ValueError:
            raise ValueError(f"Concepto Final '{concepto_str}' inválido.")

        # Función auxiliar para parsear los diccionarios de criterios desde el request (JSON)
        def parsear_criterio(clave: str) -> CriterioEvaluacion:
            data = datos_revision.get(clave, {})
            estado_str = data.get('estado', 'PENDIENTE')
            try:
                estado = EstadoCriterio(estado_str)
            except ValueError:
                raise ValueError(f"Estado de criterio '{clave}' inválido: {estado_str}")
            
            return CriterioEvaluacion(
                estado=estado,
                observacion=data.get('observacion')
            )
            
        pertinencia = parsear_criterio('pertinencia')
        objetivos = parsear_criterio('objetivos')
        metodologia = parsear_criterio('metodologia')
        viabilidad = parsear_criterio('viabilidad')

        # === REGLA DE NEGOCIO PRIMORDIAL ===
        # Si da concepto FAVORABLE absoluto, 
        # ningún criterio debiese estar en 'NO_CUMPLE'.
        criterios = [pertinencia, objetivos, metodologia, viabilidad]
        if concepto == ConceptoFinal.FAVORABLE:
            for crit in criterios:
                if crit.estado == EstadoCriterio.NO_CUMPLE:
                    raise ValueError(
                        "Operación rechazada por la capa de Dominio: No se puede emitir un concepto "
                        "100% FAVORABLE si existen criterios evaluados como 'NO CUMPLE'."
                    )

        # Construir Entidad (Agregado)
        revision = RevisionPedagogica(
            id=RevisionPedagogicaId(None),
            salida_id=SalidaId(salida_id),
            coordinador_id=UsuarioId(coordinador_id),
            pertinencia=pertinencia,
            objetivos=objetivos,
            metodologia=metodologia,
            viabilidad=viabilidad,
            concepto_final=concepto
        )

        # 1. Guardar la revisión física del Coordinador
        RevisionGuardada = self.revision_repo.guardar(revision)

        # 2. Repercutir el efecto en la propia Entidad Salida
        salida_id_obj = SalidaId(salida_id)
        salida = self.salida_repo.obtener_por_id(salida_id_obj)
        
        if salida:
            if concepto == ConceptoFinal.FAVORABLE:
                salida.cambiar_estado(EstadoSalida.FAVORABLE)
            elif concepto == ConceptoFinal.FAVORABLE_CON_AJUSTES:
                salida.cambiar_estado(EstadoSalida.PENDIENTE_AJUSTE)
            elif concepto == ConceptoFinal.NO_FAVORABLE:
                salida.cambiar_estado(EstadoSalida.RECHAZADA)
            
            # Guardamos la salida actualizada en su repositorio
            self.salida_repo.guardar(salida)
        else:
            raise ValueError("No se encontró la salida especificada para actualizar su estado.")
            
        return RevisionGuardada
