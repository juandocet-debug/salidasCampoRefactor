from django.db import models

class PlaneacionModelo(models.Model):
    salida_id = models.IntegerField() # FK a salidas_core_salida logica
    competencias = models.TextField(blank=True, null=True)
    resultados = models.TextField(blank=True, null=True)
    guion = models.TextField(blank=True, null=True)
    requiere_guia = models.BooleanField(default=False)

    class Meta:
        db_table = 'salidas_planeacion_planeacion'
        verbose_name = 'Planeacion Pedagogica'
        verbose_name_plural = 'Planeaciones Pedagogicas'

    def __str__(self):
        return f"Planeacion de la Salida {self.salida_id}"
