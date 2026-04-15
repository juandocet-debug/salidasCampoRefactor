"""
Caso de Uso: Consultar Salida (Vista Admin del Sistema)

Orquesta los repositorios de dominio para obtener el expediente
completo de una salida sin acceder jamás a modelos de infraestructura
de otros módulos directamente — respetando la arquitectura hexagonal.
"""
from modulos.Salidas.Core.dominio.SalidaRepository import SalidaRepository
from modulos.Salidas.Itinerario.dominio.ItinerarioRepository import ItinerarioRepository


class ConsultarSalidaAdminCasoUso:
    def __init__(
        self,
        salida_repo: SalidaRepository,
        itinerario_repo: ItinerarioRepository,
    ):
        self.salida_repo     = salida_repo
        self.itinerario_repo = itinerario_repo

    def ejecutar(self, salida_id: int) -> dict:
        """
        Retorna un dict con todos los datos de la salida y su itinerario.
        Lanza ValueError si la salida no existe.
        """
        salida = self.salida_repo.get_by_id(salida_id)
        if not salida:
            raise ValueError(f"Salida {salida_id} no encontrada")

        # Buscar el itinerario asociado a esta salida
        todos_los_itinerarios = self.itinerario_repo.get_all()
        itinerario = next(
            (i for i in todos_los_itinerarios if i.salida_id.value == salida_id),
            None
        )

        puntos_ruta = []
        if itinerario:
            puntos = self.itinerario_repo.get_puntos_by_itinerario(itinerario.id.value)
            for p in sorted(puntos, key=lambda x: x.orden.value):
                tipo = p.tipo.value if p.tipo else ''
                puntos_ruta.append({
                    'id': p.id.value,
                    'nombre': p.nombre.value if p.nombre else '',
                    'motivo': tipo,
                    'es_retorno': tipo == 'retorno',
                    'orden': p.orden.value if p.orden else 0,
                    'latitud': float(p.latitud.value) if p.latitud and p.latitud.value else None,
                    'longitud': float(p.longitud.value) if p.longitud and p.longitud.value else None,
                    # Campos extra que no están en el objeto de dominio base
                    # se enriquecen en el controlador desde el modelo de infraestructura
                    # para no ensuciar el dominio con campos de presentación
                    'tiempo_estimado': None,
                    'actividad': None,
                    'fecha_programada': None,
                    'hora_programada': None,
                    'notas_itinerario': None,
                })

        return {
            'salida': salida,
            'puntos_ruta': puntos_ruta,
            'itinerario_id': itinerario.id.value if itinerario else None,
        }
