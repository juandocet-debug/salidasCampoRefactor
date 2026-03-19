# infraestructura/salidas/repositorio_django.py
# ─────────────────────────────────────────────────────────────────────────────
# ADAPTADOR DE SALIDA — Implementación Django del ISalidaRepositorio
#
# Este es el único lugar donde se usa el ORM de Django para el slice Salidas.
# Traduce entre el modelo Django (ORM) y la entidad de dominio (Python puro).
#
# Patrón: Repository + Mapper (ORM Model ↔ Entidad de Dominio)
# ─────────────────────────────────────────────────────────────────────────────

from dominio.salidas.entidades import Salida as SalidaEntidad
from dominio.salidas.valor_objetos import EstadoSalida
from dominio.salidas.excepciones import SalidaNoEncontrada
from aplicacion.salidas.puertos.repositorio import ISalidaRepositorio

# Import del modelo Django (único punto donde toca el ORM)
from aplicaciones.salidas.modelos.salida import Salida as SalidaORM


class SalidaRepositorioDjango(ISalidaRepositorio):
    """
    Implementación concreta del repositorio usando Django ORM.

    Responsabilidades:
    1. Traducir entidad de dominio → modelo ORM (para persistir)
    2. Traducir modelo ORM → entidad de dominio (para retornar)
    3. NO contiene lógica de negocio — eso vive en el dominio.
    """

    # ── Persistencia ──────────────────────────────────────────────────────

    def guardar(self, salida: SalidaEntidad) -> SalidaEntidad:
        """INSERT si no tiene id, UPDATE si ya tiene id."""
        if salida.id:
            orm_obj = SalidaORM.objects.get(pk=salida.id)
            self._aplicar_entidad_a_orm(salida, orm_obj)
        else:
            orm_obj = SalidaORM()
            self._aplicar_entidad_a_orm(salida, orm_obj)

        orm_obj.save()
        return self._a_entidad(orm_obj)

    # ── Consultas ─────────────────────────────────────────────────────────

    def obtener_por_id(self, salida_id: int) -> SalidaEntidad:
        try:
            return self._a_entidad(SalidaORM.objects.get(pk=salida_id))
        except SalidaORM.DoesNotExist:
            raise SalidaNoEncontrada(salida_id)

    def obtener_por_codigo(self, codigo: str) -> SalidaEntidad:
        try:
            return self._a_entidad(SalidaORM.objects.get(codigo=codigo))
        except SalidaORM.DoesNotExist:
            raise SalidaNoEncontrada(codigo)

    def listar_por_profesor(self, profesor_id: int) -> list[SalidaEntidad]:
        qs = SalidaORM.objects.filter(profesor_id=profesor_id).order_by('-created_at')
        return [self._a_entidad(obj) for obj in qs]

    def listar_por_estado(self, estado: EstadoSalida) -> list[SalidaEntidad]:
        qs = SalidaORM.objects.filter(estado=estado.value).order_by('-created_at')
        return [self._a_entidad(obj) for obj in qs]

    def listar_activas(self) -> list[SalidaEntidad]:
        estados_terminados = [
            EstadoSalida.CERRADA.value,
            EstadoSalida.CANCELADA.value,
            EstadoSalida.RECHAZADA.value,
        ]
        qs = SalidaORM.objects.exclude(estado__in=estados_terminados).order_by('-created_at')
        return [self._a_entidad(obj) for obj in qs]

    # ── Mappers (los dos sentidos) ────────────────────────────────────────

    @staticmethod
    def _a_entidad(orm: SalidaORM) -> SalidaEntidad:
        """ORM Model → Entidad de dominio (Python puro)."""
        return SalidaEntidad(
            id=             orm.pk,
            codigo=         orm.codigo,
            nombre=         orm.nombre,
            asignatura=     orm.asignatura,
            semestre=       orm.semestre,
            facultad=       orm.facultad,
            programa=       orm.programa,
            num_estudiantes=orm.num_estudiantes,
            justificacion=  orm.justificacion,
            estado=         EstadoSalida(orm.estado),
            profesor_id=    orm.profesor_id,
            fecha_inicio=   orm.fecha_inicio,
            fecha_fin=      orm.fecha_fin,
            hora_inicio=    orm.hora_inicio,
            distancia_total_km=orm.distancia_total_km,
            duracion_dias=  orm.duracion_dias,
            horas_viaje=    orm.horas_viaje,
            costo_estimado= orm.costo_estimado,
            icono=          orm.icono,
            color=          orm.color,
            created_at=     orm.created_at,
            updated_at=     orm.updated_at,
        )

    @staticmethod
    def _aplicar_entidad_a_orm(entidad: SalidaEntidad, orm: SalidaORM) -> None:
        """Entidad de dominio → ORM Model (escribe campos)."""
        orm.nombre          = entidad.nombre
        orm.asignatura      = entidad.asignatura
        orm.semestre        = entidad.semestre
        orm.facultad        = entidad.facultad
        orm.programa        = entidad.programa
        orm.num_estudiantes = entidad.num_estudiantes
        orm.justificacion   = entidad.justificacion
        orm.estado          = entidad.estado.value
        orm.profesor_id     = entidad.profesor_id
        orm.fecha_inicio    = entidad.fecha_inicio
        orm.fecha_fin       = entidad.fecha_fin
        orm.hora_inicio     = entidad.hora_inicio
        orm.distancia_total_km = entidad.distancia_total_km
        orm.duracion_dias   = entidad.duracion_dias
        orm.horas_viaje     = entidad.horas_viaje
        orm.costo_estimado  = entidad.costo_estimado
        orm.icono           = entidad.icono
        orm.color           = entidad.color
        # Nota: orm.codigo lo genera el save() del modelo ORM si está vacío
