from django.db import models


class CargaDirectorio(models.Model):
    """
    Registro de cada vez que el Admin sube un CSV con la nómina estudiantil.
    Solo UNA carga puede estar activa a la vez.
    """
    nombre_archivo  = models.CharField(max_length=255)
    fecha_carga     = models.DateTimeField(auto_now_add=True)
    total_registros = models.IntegerField(default=0)
    cargados        = models.IntegerField(default=0)
    duplicados      = models.IntegerField(default=0)
    errores         = models.IntegerField(default=0)
    activa          = models.BooleanField(default=True)
    cargado_por     = models.IntegerField(null=True, blank=True)  # usuario_id del admin

    class Meta:
        db_table     = 'estudiante_carga_directorio'
        verbose_name = 'Carga de Directorio'
        ordering     = ['-fecha_carga']


class DirectorioEstudiante(models.Model):
    """
    Un registro por cada estudiante activo según el CSV cargado.
    Las credenciales (correo + password_hash) son las que el estudiante
    usa para autenticarse al escanear el QR.
    """
    carga           = models.ForeignKey(CargaDirectorio, on_delete=models.CASCADE, related_name='estudiantes')
    correo          = models.EmailField()
    password_hash   = models.CharField(max_length=255)
    nombre          = models.CharField(max_length=200)
    apellido        = models.CharField(max_length=200)
    facultad        = models.CharField(max_length=200, blank=True)
    programa        = models.CharField(max_length=200, blank=True)
    activo          = models.BooleanField(default=True)

    class Meta:
        db_table     = 'estudiante_directorio'
        verbose_name = 'Directorio Estudiantil'
        # Un mismo correo no se repite dentro de la misma carga
        unique_together = ('carga', 'correo')


class EstudianteSalida(models.Model):
    """
    Inscripción de un estudiante en una salida específica.
    Guarda la foto de identificación y la firma digital
    que sirven como autorización formal.
    """
    ESTADO_CHOICES = [
        ('pendiente',  'Pendiente de revisión'),
        ('autorizado', 'Autorizado'),
        ('rechazado',  'Rechazado'),
    ]

    salida_id         = models.IntegerField()
    usuario_id        = models.IntegerField()        # FK a UsuarioModel
    foto_ficha        = models.ImageField(upload_to='inscripciones/fotos/',   null=True, blank=True)
    firma_digital     = models.ImageField(upload_to='inscripciones/firmas/',  null=True, blank=True)
    estado            = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'estudiante_salida_inscripcion'
        verbose_name    = 'Inscripción de Estudiante'
        unique_together = ('salida_id', 'usuario_id')

    def __str__(self):
        return f"Inscripción usuario {self.usuario_id} en salida {self.salida_id} [{self.estado}]"


class DocumentoEstudiante(models.Model):
    """
    Documentos requeridos para el estudiante (ej. EPS, Cédula).
    Se asocian al usuario_id de la tabla general de Usuarios.
    """
    TIPO_CHOICES = [
        ('eps', 'Certificado EPS'),
        ('documento_identidad', 'Documento de Identidad'),
    ]
    
    usuario_id     = models.IntegerField()  # FK a UsuarioModel
    tipo_documento = models.CharField(max_length=50, choices=TIPO_CHOICES)
    archivo        = models.FileField(upload_to='estudiantes/documentos/')
    fecha_subida   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table        = 'estudiante_documento'
        verbose_name    = 'Documento de Estudiante'
        unique_together = ('usuario_id', 'tipo_documento')

    def __str__(self):
        return f"Doc {self.tipo_documento} del usuario {self.usuario_id}"
