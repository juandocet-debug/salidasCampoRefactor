from django.db import models
import uuid

class ParametroModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clave = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=100)
    valor = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=50)

    class Meta:
        db_table = 'logistica_parametro'
