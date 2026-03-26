from django.db import models

class ParadaModelo(models.Model):
    itinerario_id = models.IntegerField(help_text="ID del itinerario principal de la Salida")
    orden = models.IntegerField(default=1)
    latitud = models.FloatField()
    longitud = models.FloatField()
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=50, default="trabajo_campo")
    
    # Nuevos metadatos de Tarjeta (UI)
    tiempo_estimado = models.CharField(max_length=50, null=True, blank=True)
    actividad = models.TextField(null=True, blank=True)
    fecha_programada = models.CharField(max_length=50, null=True, blank=True)
    hora_programada = models.CharField(max_length=50, null=True, blank=True)
    notas_itinerario = models.TextField(null=True, blank=True)
    icono = models.CharField(max_length=100, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'salidas_itinerario_parada'
        verbose_name = 'Parada del Itinerario'
        verbose_name_plural = 'Paradas del Itinerario'

    def __str__(self):
        return f"Parada {self.orden}: {self.nombre} (Itinerario {self.itinerario_id})"
