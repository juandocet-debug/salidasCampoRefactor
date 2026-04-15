# backend/modulos/Salidas/Consejo/aplicacion/RegistrarDecisionConsejoCasoUso.py
"""
Caso de Uso: El Consejo de Facultad registra su decisión final sobre una salida.
Orquesta los repositorios y aplica las reglas de negocio:
  - La salida debe estar en estado FAVORABLE (validada por el Coordinador).
  - Registra la DecisionConsejo con acta y fecha oficial.
  - Actualiza el estado de la Salida maestra (APROBADA / RECHAZADA).
"""
from typing import Dict, Any

from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida
from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Salidas.Consejo.dominio.ConsejoRepository import ConsejoRepository
from modulos.Salidas.Consejo.dominio.DecisionConsejo import DecisionConsejo

from datetime import date


class RegistrarDecisionConsejoCasoUso:
    """
    Caso de Uso: Registrar la decisión oficial del Consejo de Facultad.
    Bloquea operaciones en salidas que no estén en estado FAVORABLE.
    """

    MAPA_ESTADO = {
        'aprobado': EstadoSalida.APROBADA,
        'rechazado': EstadoSalida.RECHAZADA,
        'ajustes': EstadoSalida.PENDIENTE_AJUSTE,
    }

    def __init__(self, consejo_repo: ConsejoRepository, salida_repo: SalidaRepository):
        self.consejo_repo = consejo_repo
        self.salida_repo = salida_repo

    def ejecutar(self, salida_id: int, concejal_id: int, datos: Dict[str, Any]) -> DecisionConsejo:
        # 1. Verificar que la salida exista y esté en estado FAVORABLE
        salida = self.salida_repo.get_by_id(salida_id)
        if not salida:
            raise ValueError(f"No se encontró la salida con ID {salida_id}.")

        if salida.estado not in [EstadoSalida.FAVORABLE, EstadoSalida.APROBADA, EstadoSalida.RECHAZADA]:
            raise ValueError(
                f"La salida '{salida.nombre.value}' no puede ser procesada por el Consejo. "
                f"Estado actual: '{salida.estado.value}'. Se requiere estado 'favorable'."
            )

        # 2. Parsear y validar el concepto financiero enviado
        concepto_str = datos.get('concepto_financiero', '').lower()
        if concepto_str not in self.MAPA_ESTADO:
            raise ValueError(
                f"Concepto financiero '{concepto_str}' inválido. "
                f"Valores aceptados: {list(self.MAPA_ESTADO.keys())}"
            )

        # 3. Parsear fecha_acta si viene
        fecha_acta = None
        fecha_acta_str = datos.get('fecha_acta')
        if fecha_acta_str:
            try:
                fecha_acta = date.fromisoformat(fecha_acta_str)
            except ValueError:
                raise ValueError(f"Formato de fecha_acta inválido: '{fecha_acta_str}'. Use YYYY-MM-DD.")

        # 4. Construir entidad de dominio
        decision = DecisionConsejo(
            salida_id=salida_id,
            concejal_id=concejal_id,
            concepto_financiero=concepto_str,
            observaciones=datos.get('observaciones', ''),
            acta=datos.get('acta', ''),
            fecha_acta=fecha_acta,
        )

        # 5. Persistir la decisión
        decision_guardada = self.consejo_repo.guardar(decision)

        # 6. Transición de estado de la Salida maestra
        nuevo_estado = self.MAPA_ESTADO[concepto_str]
        salida.cambiar_estado(nuevo_estado)
        self.salida_repo.save(salida)

        return decision_guardada
