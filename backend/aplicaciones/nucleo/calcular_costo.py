# aplicaciones/nucleo/calcular_costo.py
# DEPRECATED: Usar nucleo.servicios.costo directamente.
# Este shim se mantiene para no romper imports existentes.
from .servicios.costo import calcular_costo_salida, ResultadoCosto  # noqa: F401
