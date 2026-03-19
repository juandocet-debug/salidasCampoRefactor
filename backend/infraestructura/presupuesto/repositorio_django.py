# infraestructura/presupuesto/repositorio_django.py  (~115 líneas)

from dominio.presupuesto.entidades import Presupuesto, Gasto, CategoriaGasto
from aplicacion.presupuesto.casos_uso import IPresupuestoRepositorio

from aplicaciones.presupuesto.modelos import (
    Presupuesto as PresupuestoORM,
    Gasto as GastoORM,
)


class PresupuestoRepositorioDjango(IPresupuestoRepositorio):

    def guardar(self, p: Presupuesto) -> Presupuesto:
        if p.id:
            orm = PresupuestoORM.objects.get(pk=p.id)
        else:
            orm = PresupuestoORM(salida_id=p.salida_id)
        orm.total_asignado = p.total_asignado
        orm.ejecutado      = p.ejecutado
        orm.save()
        p.id = orm.pk
        return p

    def obtener_por_salida(self, salida_id: int) -> Presupuesto:
        orm       = PresupuestoORM.objects.get(salida_id=salida_id)
        gastos    = [self._gasto_a_entidad(g) for g in orm.gastos.all()]
        presupuesto = Presupuesto(
            id=             orm.pk,
            salida_id=      orm.salida_id,
            total_asignado= orm.total_asignado,
            ejecutado=      orm.ejecutado,
            gastos=         gastos,
        )
        return presupuesto

    def guardar_gasto(self, gasto: Gasto) -> Gasto:
        orm = GastoORM.objects.create(
            presupuesto_id=   gasto.presupuesto_id,
            categoria=        gasto.categoria.value if gasto.categoria else '',
            descripcion=      gasto.descripcion,
            monto=            gasto.monto,
            registrado_por_id=gasto.registrado_por_id,
        )
        return self._gasto_a_entidad(orm)

    @staticmethod
    def _gasto_a_entidad(orm: GastoORM) -> Gasto:
        return Gasto(
            id=               orm.pk,
            presupuesto_id=   orm.presupuesto_id,
            categoria=        CategoriaGasto(orm.categoria) if orm.categoria else None,
            descripcion=      orm.descripcion,
            monto=            orm.monto,
            fecha=            orm.fecha,
            registrado_por_id=orm.registrado_por_id,
        )
