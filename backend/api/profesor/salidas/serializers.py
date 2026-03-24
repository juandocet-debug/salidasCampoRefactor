# CAPA: API — BFF Profesor
# QUÉ HACE: Serializers para el módulo de salidas del profesor
# NO DEBE CONTENER: lógica de negocio, ORM, queries a BD

from rest_framework import serializers


class SalidaSerializer(serializers.Serializer):
    """Serializer de respuesta — todos los campos de la entidad Salida."""
    id                 = serializers.IntegerField(read_only=True)
    codigo             = serializers.CharField(read_only=True)
    nombre             = serializers.CharField()
    asignatura         = serializers.CharField()
    semestre           = serializers.CharField()
    facultad           = serializers.CharField()
    programa           = serializers.CharField()
    num_estudiantes    = serializers.IntegerField()
    justificacion      = serializers.CharField(required=False, allow_blank=True)
    estado             = serializers.CharField(read_only=True)
    profesor_id        = serializers.IntegerField(read_only=True)
    fecha_inicio       = serializers.DateField(required=False, allow_null=True)
    fecha_fin          = serializers.DateField(required=False, allow_null=True)
    hora_inicio        = serializers.TimeField(required=False, allow_null=True)
    distancia_total_km = serializers.FloatField(required=False)
    duracion_dias      = serializers.FloatField(required=False)
    horas_viaje        = serializers.FloatField(required=False)
    costo_estimado     = serializers.FloatField(read_only=True)
    icono              = serializers.CharField(required=False)
    color              = serializers.CharField(required=False)
    created_at         = serializers.DateTimeField(read_only=True)
    updated_at         = serializers.DateTimeField(read_only=True)

    # Campos anidados omitidos durante refactor (añadidos de vuelta)
    planeacion           = serializers.SerializerMethodField()
    puntos_ruta          = serializers.SerializerMethodField()
    criterios_evaluacion = serializers.SerializerMethodField()

    def get_planeacion(self, instance):
        if not getattr(instance, 'resumen', None) and not getattr(instance, 'objetivo_general', None):
            return None
        
        objs_str = getattr(instance, 'objetivos_especificos', '')
        objetivos = [{'descripcion': o.strip()} for o in objs_str.split('\n') if o.strip()]

        return {
            'resumen': getattr(instance, 'resumen', ''),
            'relacion_syllabus': getattr(instance, 'relacion_syllabus', ''),
            'productos_esperados': getattr(instance, 'productos_esperados', ''),
            'obj_general': getattr(instance, 'objetivo_general', ''),
            'metodologia': getattr(instance, 'estrategia_metodologica', ''),
            'objetivos': objetivos
        }

    def get_puntos_ruta(self, instance):
        rutas = getattr(instance, 'puntos_ruta_data', [])
        retornos = getattr(instance, 'puntos_retorno_data', [])
        # Combinar para la respuesta plana serializada y castear si fuera necesario
        all_pts = rutas + retornos
        res = []
        for p in all_pts:
            res.append({
                'nombre': p.get('nombre', ''),
                'latitud': p.get('latitud'),
                'longitud': p.get('longitud'),
                'motivo': p.get('motivo', ''),
                'tiempo_estimado': p.get('tiempo_estimado', ''),
                'actividad': p.get('actividad', ''),
                'es_hospedaje': p.get('es_hospedaje', False),
                'fecha_programada': p.get('fecha_programada'),
                'hora_programada': p.get('hora_programada'),
                'notas_itinerario': p.get('notas_itinerario', ''),
                'icono': p.get('icono', ''),
                'color': p.get('color', ''),
                'es_retorno': p.get('es_retorno', False)
            })
        return res

    def get_criterios_evaluacion(self, instance):
        criterios_str = getattr(instance, 'criterio_evaluacion_texto', '')
        criterios = [{'descripcion': c.strip()} for c in criterios_str.split('\n') if c.strip()]
        return criterios

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # El enum se serializa como "EstadoSalida.BORRADOR", necesitamos solo "borrador"
        if hasattr(instance, 'estado') and hasattr(instance.estado, 'value'):
            data['estado'] = instance.estado.value
        return data


class CrearSalidaInputSerializer(serializers.Serializer):
    """Serializer de entrada — valida datos del formulario de creación."""
    nombre             = serializers.CharField(max_length=200)
    asignatura         = serializers.CharField(max_length=200)
    semestre           = serializers.CharField(max_length=20)
    facultad           = serializers.CharField(max_length=200)
    programa           = serializers.CharField(max_length=200)
    num_estudiantes    = serializers.IntegerField(min_value=1)
    justificacion      = serializers.CharField(required=False, allow_blank=True)
    fecha_inicio       = serializers.DateField(required=False, allow_null=True)
    fecha_fin          = serializers.DateField(required=False, allow_null=True)
    hora_inicio        = serializers.TimeField(required=False, allow_null=True)
    hora_fin           = serializers.TimeField(required=False, allow_null=True)
    distancia_total_km = serializers.FloatField(required=False, default=0.0)
    duracion_dias      = serializers.FloatField(required=False, default=1.0)
    horas_viaje        = serializers.FloatField(required=False, default=9.0)
    icono              = serializers.CharField(required=False)
    color              = serializers.CharField(required=False)

    # Campos recuperados
    resumen                 = serializers.CharField(required=False, allow_blank=True)
    relacion_syllabus       = serializers.CharField(required=False, allow_blank=True)
    productos_esperados     = serializers.CharField(required=False, allow_blank=True)
    objetivo_general        = serializers.CharField(required=False, allow_blank=True)
    objetivos_especificos   = serializers.CharField(required=False, allow_blank=True)
    estrategia_metodologica = serializers.CharField(required=False, allow_blank=True)
    punto_partida           = serializers.CharField(required=False, allow_blank=True)
    parada_max              = serializers.CharField(required=False, allow_blank=True)
    puntos_ruta_data        = serializers.JSONField(required=False, default=list)
    puntos_retorno_data     = serializers.JSONField(required=False, default=list)
    criterio_evaluacion_texto = serializers.CharField(required=False, allow_blank=True)
    # Ignoramos es_grupal etc. que maneja lógica externa o que podemos persistir después


class ActualizarSalidaInputSerializer(serializers.Serializer):
    """Serializer de entrada — valida datos del formulario de edición."""
    nombre             = serializers.CharField(max_length=200, required=False)
    asignatura         = serializers.CharField(max_length=200, required=False)
    semestre           = serializers.CharField(max_length=20, required=False)
    facultad           = serializers.CharField(max_length=200, required=False)
    programa           = serializers.CharField(max_length=200, required=False)
    num_estudiantes    = serializers.IntegerField(min_value=1, required=False)
    justificacion      = serializers.CharField(required=False, allow_blank=True)
    fecha_inicio       = serializers.DateField(required=False, allow_null=True)
    fecha_fin          = serializers.DateField(required=False, allow_null=True)
    hora_inicio        = serializers.TimeField(required=False, allow_null=True)
    hora_fin           = serializers.TimeField(required=False, allow_null=True)
    distancia_total_km = serializers.FloatField(required=False)
    duracion_dias      = serializers.FloatField(required=False)
    horas_viaje        = serializers.FloatField(required=False)
    icono              = serializers.CharField(required=False)
    color              = serializers.CharField(required=False)

    # Campos recuperados
    resumen                 = serializers.CharField(required=False, allow_blank=True)
    relacion_syllabus       = serializers.CharField(required=False, allow_blank=True)
    productos_esperados     = serializers.CharField(required=False, allow_blank=True)
    objetivo_general        = serializers.CharField(required=False, allow_blank=True)
    objetivos_especificos   = serializers.CharField(required=False, allow_blank=True)
    estrategia_metodologica = serializers.CharField(required=False, allow_blank=True)
    punto_partida           = serializers.CharField(required=False, allow_blank=True)
    parada_max              = serializers.CharField(required=False, allow_blank=True)
    puntos_ruta_data        = serializers.JSONField(required=False, default=list)
    puntos_retorno_data     = serializers.JSONField(required=False, default=list)
    criterio_evaluacion_texto = serializers.CharField(required=False, allow_blank=True)

