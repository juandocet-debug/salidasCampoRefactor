# infraestructura/checklist/repositorio_django.py
# ─────────────────────────────────────────────────────────────────────────────
# ADAPTADOR Django para el slice Checklist
# ─────────────────────────────────────────────────────────────────────────────

from dominio.checklist.entidades import (
    Checklist, ItemChecklist, CategoriaChecklist, EstadoItem, ITEMS_PREDETERMINADOS
)
from aplicacion.checklist.casos_uso import IChecklistRepositorio

from aplicaciones.checklist.modelos import ItemChecklist as ItemORM


class ChecklistRepositorioDjango(IChecklistRepositorio):

    def guardar_item(self, item: ItemChecklist) -> ItemChecklist:
        orm = ItemORM.objects.get(pk=item.id)
        orm.estado      = item.estado.value
        orm.observacion = item.observacion
        orm.evidencia_url = item.evidencia_url
        orm.save(update_fields=['estado', 'observacion', 'evidencia_url'])
        return self._item_a_entidad(orm)

    def obtener_checklist(self, asignacion_id: int) -> Checklist:
        items_orm = ItemORM.objects.filter(asignacion_id=asignacion_id).order_by('categoria', 'item')
        items = [self._item_a_entidad(i) for i in items_orm]
        return Checklist(asignacion_id=asignacion_id, items=items)

    def crear_checklist_inicial(self, asignacion_id: int) -> Checklist:
        """
        Inserta los 18 ítems predeterminados en BD.
        Se llama desde la señal post_save de Asignacion.
        """
        checklist = Checklist.nuevo_para_asignacion(asignacion_id)
        items_guardados = []
        for item in checklist.items:
            orm = ItemORM.objects.create(
                asignacion_id=asignacion_id,
                categoria=    item.categoria.value,
                item=         item.item,
                estado=       item.estado.value,
            )
            item.id = orm.pk
            items_guardados.append(item)
        checklist.items = items_guardados
        return checklist

    @staticmethod
    def _item_a_entidad(orm: ItemORM) -> ItemChecklist:
        return ItemChecklist(
            id=            orm.pk,
            asignacion_id= orm.asignacion_id,
            categoria=     CategoriaChecklist(orm.categoria),
            item=          orm.item,
            estado=        EstadoItem(orm.estado),
            observacion=   orm.observacion,
            evidencia_url= orm.evidencia_url,
        )
