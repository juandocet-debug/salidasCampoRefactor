# infraestructura/novedades/repositorio_django.py
# ─────────────────────────────────────────────────────────────────────────────
# ADAPTADOR Django para el slice Novedades
# ─────────────────────────────────────────────────────────────────────────────

from datetime import timezone

from dominio.novedades.entidades import Novedad, TipoNovedad, Urgencia, EstadoNovedad
from aplicacion.novedades.casos_uso import INovedadRepositorio

from aplicaciones.novedades.modelos import Novedad as NovedadORM


class NovedadRepositorioDjango(INovedadRepositorio):

    def guardar(self, novedad: Novedad) -> Novedad:
        if novedad.id:
            orm = NovedadORM.objects.get(pk=novedad.id)
        else:
            orm = NovedadORM(
                salida_id=        novedad.salida_id,
                reportado_por_id= novedad.reportado_por_id,
            )
        orm.tipo          = novedad.tipo.value if novedad.tipo else ''
        orm.urgencia      = novedad.urgencia.value if novedad.urgencia else ''
        orm.descripcion   = novedad.descripcion
        orm.estado        = novedad.estado.value
        orm.latitud       = novedad.latitud
        orm.longitud      = novedad.longitud
        orm.resuelto_en   = novedad.resuelto_en
        orm.save()
        return self._a_entidad(orm)

    def obtener(self, novedad_id: int) -> Novedad:
        return self._a_entidad(NovedadORM.objects.get(pk=novedad_id))

    def listar_por_salida(self, salida_id: int) -> list[Novedad]:
        return [self._a_entidad(n)
                for n in NovedadORM.objects.filter(salida_id=salida_id)]

    @staticmethod
    def _a_entidad(orm: NovedadORM) -> Novedad:
        return Novedad(
            id=               orm.pk,
            salida_id=        orm.salida_id,
            tipo=             TipoNovedad(orm.tipo)     if orm.tipo     else None,
            urgencia=         Urgencia(orm.urgencia)    if orm.urgencia else None,
            descripcion=      orm.descripcion,
            estado=           EstadoNovedad(orm.estado),
            latitud=          orm.latitud,
            longitud=         orm.longitud,
            reportado_por_id= orm.reportado_por_id,
            registrado_en=    orm.registrado_en,
            resuelto_en=      orm.resuelto_en,
        )
