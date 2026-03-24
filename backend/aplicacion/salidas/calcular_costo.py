# CAPA: Aplicación
# QUÉ HACE: Caso de uso para calcular el costo estimado de una salida
# NO DEBE CONTENER: Django, ORM, lógica de vistas

from dominio.salidas.puerto import ISalidaRepositorio
from dominio.salidas.excepciones import SalidaNoEncontrada
from dominio.parametros.puerto import IParametrosRepositorio
from dominio.compartido.servicios_costo import calcular_costo_salida, ResultadoCosto


class CalcularCostoSalidaCasoUso:

    def __init__(
        self,
        repo_salidas: ISalidaRepositorio,
        repo_parametros: IParametrosRepositorio,
    ):
        self.repo_salidas    = repo_salidas
        self.repo_parametros = repo_parametros

    def ejecutar(
        self,
        salida_id:    int,
        profesor_id:  int,
        rendimiento:  float = None,
    ) -> ResultadoCosto:

        salida = self.repo_salidas.obtener_por_id(salida_id)
        if not salida:
            raise SalidaNoEncontrada(salida_id)
        salida.verificar_acceso(profesor_id)

        parametros = self.repo_parametros.obtener()

        # Si no se especifica rendimiento, usar el del bus por defecto
        # (se refinará cuando exista tipo_vehiculo en Salida)
        rend = rendimiento or parametros.rendimiento_bus

        resultado = calcular_costo_salida(
            distancia_km=salida.distancia_total_km,
            duracion_dias=salida.duracion_dias,
            horas_totales=salida.horas_viaje,
            precio_galon=parametros.precio_galon,
            rendimiento=rend,
            costo_noche=parametros.costo_noche,
            costo_hora_extra=parametros.costo_hora_extra,
            costo_hora_extra_2=parametros.costo_hora_extra_2,
            max_horas_viaje=parametros.max_horas_viaje,
            horas_buffer=parametros.horas_buffer,
        )

        # Persiste el costo estimado en la salida
        salida.costo_estimado = resultado.total
        self.repo_salidas.guardar(salida)

        return resultado
