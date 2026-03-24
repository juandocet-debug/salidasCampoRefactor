# CAPA: Aplicación — Compartido
# QUÉ HACE: Caso de uso para recalcular costos de todas las salidas activas
# NO DEBE CONTENER: Django, ORM, imports de infraestructura

from typing import List
from dominio.salidas.entidad import Salida
from dominio.salidas.puerto import ISalidaRepositorio
from dominio.compartido.servicios_costo import calcular_costo_salida


class RecalcularCostosSalidasCasoUso:

    def __init__(self, repositorio: ISalidaRepositorio):
        self.repo = repositorio

    def ejecutar(
        self,
        precio_galon:     float,
        rendimiento:      float,
        costo_noche:      float,
    ) -> List[Salida]:
        salidas = self.repo.listar_activas()
        actualizadas = []

        for salida in salidas:
            resultado = calcular_costo_salida(
                distancia_km=salida.distancia_total_km,
                duracion_dias=salida.duracion_dias,
                horas_totales=salida.horas_viaje,
                precio_galon=precio_galon,
                rendimiento=rendimiento,
                costo_noche=costo_noche,
            )
            salida.costo_estimado = resultado.total
            self.repo.guardar(salida)
            actualizadas.append(salida)

        return actualizadas
