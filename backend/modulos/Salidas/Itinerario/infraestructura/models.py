from django.db import models

class ItinerarioModelo(models.Model):
    salida_id = models.IntegerField(unique=True) # Una salida tiene 1 itinerario activo
    poligonal_mapa = models.TextField(default='{}')
    distancia_km = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    duracion_horas = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'salidas_itinerario_itinerario'
        verbose_name = 'Itinerario'
        verbose_name_plural = 'Itinerarios'

class PuntoParadaModelo(models.Model):
    itinerario = models.ForeignKey(ItinerarioModelo, on_delete=models.CASCADE, related_name='puntos')
    orden = models.IntegerField(default=1)
    latitud = models.FloatField()
    longitud = models.FloatField()
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=50, default='trabajo_campo')

    class Meta:
        db_table = 'salidas_itinerario_punto_parada'
        verbose_name = 'Punto de Parada'
        verbose_name_plural = 'Puntos de Parada'
        ordering = ['itinerario', 'orden']
