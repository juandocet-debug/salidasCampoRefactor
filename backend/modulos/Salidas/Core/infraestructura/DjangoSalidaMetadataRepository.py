"""
Adaptador Secundario: implementación Django ORM del puerto SalidaMetadataRepository.
Concentra AQUÍ (y solo aquí) el acceso al ORM para campos extendidos de la ficha
(icono, color, resumen, objetivo_general, punto_partida / destino).
Los Casos de Uso solo ven el Puerto (interfaz abstracta).
"""
from typing import Dict, Any
from modulos.Salidas.Core.dominio.SalidaMetadataRepository import SalidaMetadataRepository

try:
    from modulos.Salidas.Core.infraestructura.models import SalidaModelo
    from modulos.Salidas.Itinerario.infraestructura.models import ItinerarioModelo, PuntoParadaModelo
except ImportError:
    SalidaModelo = None
    ItinerarioModelo = None
    PuntoParadaModelo = None


class DjangoSalidaMetadataRepository(SalidaMetadataRepository):

    def obtener_metadata(self, salida_id: int) -> Dict[str, Any]:
        resultado = {
            'icono': 'IcoMountain',
            'color': '#16a34a',
            'resumen': '',
            'objetivo_general': '',
            'destino': 'Sin destino definido',
        }

        if SalidaModelo is None:
            return resultado

        try:
            orm = SalidaModelo.objects.filter(id=salida_id).first()
            if orm:
                resultado['icono'] = orm.icono or 'IcoMountain'
                resultado['color'] = orm.color or '#16a34a'
                resultado['resumen'] = orm.resumen or ''
                resultado['objetivo_general'] = orm.objetivo_general or ''

                # Destino: primero leer del itinerario, si no del campo parada_max
                destino = None
                if ItinerarioModelo and PuntoParadaModelo:
                    itinerario = ItinerarioModelo.objects.filter(salida_id=salida_id).first()
                    if itinerario:
                        punto = PuntoParadaModelo.objects.filter(
                            itinerario_id=itinerario.id
                        ).order_by('-orden').first()
                        if punto and punto.nombre:
                            destino = punto.nombre

                if not destino and orm.parada_max:
                    destino = orm.parada_max

                if destino:
                    resultado['destino'] = destino

        except Exception as e:
            print(f"[DjangoSalidaMetadataRepository] Error obteniendo metadata salida {salida_id}: {e}")

        return resultado
