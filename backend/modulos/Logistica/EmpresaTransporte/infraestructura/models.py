from django.db import models


class EmpresaTransporteModel(models.Model):
    nit          = models.CharField(max_length=30, unique=True)
    razon_social = models.CharField(max_length=200)
    telefono     = models.CharField(max_length=20, blank=True, null=True)
    correo       = models.CharField(max_length=100, blank=True, null=True)
    contacto     = models.CharField(max_length=100, blank=True, null=True)
    activa       = models.BooleanField(default=True)
    creado_en    = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'logistica_empresa_contratada'
        verbose_name = 'Empresa de Transporte'
        verbose_name_plural = 'Empresas de Transporte'

    def __str__(self):
        return f"{self.nit} — {self.razon_social}"
