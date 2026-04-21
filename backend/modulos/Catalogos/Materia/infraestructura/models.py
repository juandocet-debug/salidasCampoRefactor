from django.db import models

class MateriaModel(models.Model):
    nombre  = models.CharField(max_length=150)
    codigo  = models.CharField(max_length=20, unique=True)
    activa  = models.BooleanField(default=True)
    programa = models.ForeignKey(
        'programa_infra.ProgramaModel',
        on_delete=models.PROTECT,      # Protege: no se borra programa si tiene materias
        null=False,
        blank=False,
        related_name='materias'
    )

    class Meta:
        db_table  = 'materias'
        app_label = 'materia_infra'

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
