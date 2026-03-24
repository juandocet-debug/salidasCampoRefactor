# CAPA: Aplicación — Módulo de Inyección de Dependencias
# Este es el ÚNICO archivo autorizado en el slice de Transporte
# para importar a la capa de Infraestructura (ORM).

from infraestructura.transporte.repositorio import VehiculoRepositorioDjango


def inyectar_repositorio():
    return VehiculoRepositorioDjango()
