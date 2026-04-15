# backend/modulos/Salidas/Consejo/infraestructura/DjangoConsejoRepository.py
from ..dominio.ConsejoRepository import ConsejoRepository
from ..dominio.DecisionConsejo import DecisionConsejo
from .models import DecisionConsejoModel
import traceback

class DjangoConsejoRepository(ConsejoRepository):

    def guardar(self, decision: DecisionConsejo) -> DecisionConsejo:
        try:
            modelo, created = DecisionConsejoModel.objects.update_or_create(
                salida_id=decision.salida_id,
                defaults={
                    'concejal_id': decision.concejal_id,
                    'concepto_financiero': decision.concepto_financiero,
                    'observaciones': decision.observaciones,
                    'acta': decision.acta,
                    'fecha_acta': decision.fecha_acta,
                    'fecha_decision': decision.fecha_decision,
                }
            )
            return self._mapear_a_dominio(modelo)
        except Exception as e:
            print(f"Error guardando DecisionConsejo: {e}")
            traceback.print_exc()
            raise Exception("No se pudo guardar la decisión del consejo en base de datos.")

    def obtener_por_salida(self, salida_id: int) -> DecisionConsejo:
        modelo = DecisionConsejoModel.objects.filter(salida_id=salida_id).first()
        if not modelo:
            return None
        return self._mapear_a_dominio(modelo)

    def _mapear_a_dominio(self, modelo: DecisionConsejoModel) -> DecisionConsejo:
        return DecisionConsejo(
            salida_id=modelo.salida_id,
            concejal_id=modelo.concejal_id,
            concepto_financiero=modelo.concepto_financiero,
            observaciones=modelo.observaciones,
            acta=modelo.acta,
            fecha_acta=modelo.fecha_acta,
            fecha_decision=modelo.fecha_decision,
        )
