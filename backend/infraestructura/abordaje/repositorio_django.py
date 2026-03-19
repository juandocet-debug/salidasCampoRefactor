# infraestructura/abordaje/repositorio_django.py
# ─────────────────────────────────────────────────────────────────────────────
# ADAPTADOR DE SALIDA — Repositorio Django del slice Abordaje
# Único punto donde se usa el ORM de Django para este slice.
# ─────────────────────────────────────────────────────────────────────────────

from datetime import timezone

from dominio.abordaje.entidades import RegistroAbordaje, DocumentoEstudiante
from dominio.abordaje.valor_objetos import TipoDocumento, RolVerificador, EstadoDocumento
from dominio.abordaje.excepciones import AbordajeNoEncontrado, CodigoInvalido
from aplicacion.abordaje.puertos.repositorio import IAbordajeRepositorio, IDocumentoRepositorio

# Los modelos ORM existentes — no los modificamos, solo los usamos
from aplicaciones.abordaje.modelos import (
    Abordaje as AbordajeORM,
    DocumentoEstudiante as DocumentoORM,
)


class AbordajeRepositorioDjango(IAbordajeRepositorio):

    def guardar(self, registro: RegistroAbordaje) -> RegistroAbordaje:
        if registro.id:
            orm = AbordajeORM.objects.get(pk=registro.id)
        else:
            orm = AbordajeORM(
                salida_id=    registro.salida_id,
                estudiante_id=registro.estudiante_id,
            )
        self._aplicar(registro, orm)
        orm.save()
        return self._a_entidad(orm)

    def obtener(self, salida_id: int, estudiante_id: int) -> RegistroAbordaje:
        try:
            return self._a_entidad(
                AbordajeORM.objects.get(salida_id=salida_id, estudiante_id=estudiante_id)
            )
        except AbordajeORM.DoesNotExist:
            raise AbordajeNoEncontrado(salida_id, estudiante_id)

    def obtener_por_codigo(self, salida_id: int, codigo: str) -> RegistroAbordaje:
        try:
            return self._a_entidad(
                AbordajeORM.objects.get(salida_id=salida_id, codigo=codigo)
            )
        except AbordajeORM.DoesNotExist:
            raise CodigoInvalido(codigo)

    def listar_por_salida(self, salida_id: int) -> list[RegistroAbordaje]:
        qs = AbordajeORM.objects.filter(salida_id=salida_id).select_related('estudiante')
        return [self._a_entidad(obj) for obj in qs]

    def contar_abordados(self, salida_id: int) -> int:
        return AbordajeORM.objects.filter(salida_id=salida_id, abordado=True).count()

    # ── Mappers ───────────────────────────────────────────────────────────

    @staticmethod
    def _a_entidad(orm: AbordajeORM) -> RegistroAbordaje:
        return RegistroAbordaje(
            id=            orm.pk,
            salida_id=     orm.salida_id,
            estudiante_id= orm.estudiante_id,
            codigo=        orm.codigo,
            codigo_expira_en=orm.codigo_expira_en,
            abordado=      orm.abordado,
            verificado_por_id=orm.verificado_por_id,
            rol_verificador=None,   # campo nuevo — migración pendiente
            verificado_en= orm.verificado_en,
            foto_url=      orm.foto_url,
        )

    @staticmethod
    def _aplicar(entidad: RegistroAbordaje, orm: AbordajeORM) -> None:
        orm.codigo           = entidad.codigo
        orm.codigo_expira_en = entidad.codigo_expira_en
        orm.abordado         = entidad.abordado
        orm.verificado_por_id= entidad.verificado_por_id
        orm.verificado_en    = entidad.verificado_en
        orm.foto_url         = entidad.foto_url


class DocumentoRepositorioDjango(IDocumentoRepositorio):

    def guardar(self, doc: DocumentoEstudiante) -> DocumentoEstudiante:
        orm, _ = DocumentoORM.objects.update_or_create(
            estudiante_id=doc.estudiante_id,
            tipo=doc.tipo.value if doc.tipo else '',
            defaults={
                'archivo_url':      doc.archivo_url,
                'estado':           doc.estado.value,
                'fecha_vencimiento':doc.fecha_vencimiento,
            }
        )
        return self._a_entidad(orm)

    def listar_por_estudiante(self, estudiante_id: int) -> list[DocumentoEstudiante]:
        return [self._a_entidad(d)
                for d in DocumentoORM.objects.filter(estudiante_id=estudiante_id)]

    def obtener(self, estudiante_id: int, tipo: TipoDocumento) -> DocumentoEstudiante:
        obj = DocumentoORM.objects.get(estudiante_id=estudiante_id, tipo=tipo.value)
        return self._a_entidad(obj)

    @staticmethod
    def _a_entidad(orm: DocumentoORM) -> DocumentoEstudiante:
        return DocumentoEstudiante(
            id=               orm.pk,
            estudiante_id=    orm.estudiante_id,
            tipo=             TipoDocumento(orm.tipo),
            archivo_url=      orm.archivo_url,
            estado=           EstadoDocumento(orm.estado),
            fecha_vencimiento=orm.fecha_vencimiento,
        )
