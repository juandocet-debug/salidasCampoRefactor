"""
DjangoEstudianteRepository — Adaptador de salida (infraestructura).
Implementa el puerto IEstudianteRepository usando Django ORM.
Es la única clase del módulo que toca la base de datos.
"""
from django.contrib.auth.hashers import make_password, check_password
from typing import List, Optional

from modulos.Salidas.Estudiante.dominio.IEstudianteRepository import IEstudianteRepository
from modulos.Salidas.Estudiante.dominio.EstudianteInscripcion import EstudianteInscripcion
from modulos.Salidas.Estudiante.dominio.EstudianteInscripcionId import EstudianteInscripcionId
from modulos.Salidas.Estudiante.dominio.EstudianteEstado import EstudianteEstado
from modulos.Salidas.Estudiante.dominio.DirectorioEstudianteEntidad import DirectorioEstudianteEntidad
from .models import DirectorioEstudiante, CargaDirectorio, EstudianteSalida


class DjangoEstudianteRepository(IEstudianteRepository):

    # ── Directorio ───────────────────────────────────────────────────────────

    def buscar_en_directorio(self, correo: str) -> Optional[DirectorioEstudianteEntidad]:
        """Busca el correo solo en la carga activa más reciente."""
        try:
            carga_activa = CargaDirectorio.objects.filter(activa=True).latest('fecha_carga')
        except CargaDirectorio.DoesNotExist:
            return None

        try:
            obj = DirectorioEstudiante.objects.get(carga=carga_activa, correo=correo, activo=True)
            return DirectorioEstudianteEntidad(
                id=obj.id, correo=obj.correo, password_hash=obj.password_hash,
                nombre=obj.nombre, apellido=obj.apellido,
                facultad=obj.facultad, programa=obj.programa,
                activo=obj.activo, carga_id=obj.carga_id,
            )
        except DirectorioEstudiante.DoesNotExist:
            return None

    def verificar_password_directorio(self, correo: str, password_raw: str) -> bool:
        try:
            carga_activa = CargaDirectorio.objects.filter(activa=True).latest('fecha_carga')
            obj = DirectorioEstudiante.objects.get(carga=carga_activa, correo=correo)
            return check_password(password_raw, obj.password_hash)
        except Exception:
            return False

    def cargar_directorio_csv(self, filas: List[dict], nombre_archivo: str, admin_id: int) -> dict:
        """Desactiva cargas anteriores, crea nueva CargaDirectorio y carga los estudiantes."""
        # Desactivar cargas previas
        CargaDirectorio.objects.filter(activa=True).update(activa=False)

        carga = CargaDirectorio.objects.create(
            nombre_archivo=nombre_archivo,
            total_registros=len(filas),
            activa=True,
            cargado_por=admin_id,
        )
        cargados = duplicados = errores = 0

        for fila in filas:
            try:
                correo = fila.get('correo', '').strip().lower()
                password = fila.get('password', '').strip()
                if not correo or not password:
                    errores += 1
                    continue

                _, created = DirectorioEstudiante.objects.get_or_create(
                    carga=carga, correo=correo,
                    defaults={
                        'password_hash': make_password(password),
                        'nombre':   fila.get('nombre', '').strip(),
                        'apellido': fila.get('apellido', '').strip(),
                        'facultad': fila.get('facultad', '').strip(),
                        'programa': fila.get('programa', '').strip(),
                    }
                )
                if created:
                    cargados += 1
                else:
                    duplicados += 1
            except Exception:
                errores += 1

        # Actualizar estadísticas de la carga
        carga.cargados   = cargados
        carga.duplicados = duplicados
        carga.errores    = errores
        carga.save()

        return {'cargados': cargados, 'duplicados': duplicados, 'errores': errores, 'total': len(filas)}

    def listar_historial_cargas(self) -> List[dict]:
        return list(CargaDirectorio.objects.values(
            'id', 'nombre_archivo', 'fecha_carga',
            'total_registros', 'cargados', 'duplicados', 'errores', 'activa'
        ))

    def eliminar_carga(self, carga_id: int) -> None:
        CargaDirectorio.objects.filter(id=carga_id).delete()

    # ── Inscripciones ────────────────────────────────────────────────────────

    def guardar_inscripcion(self, inscripcion: EstudianteInscripcion) -> EstudianteInscripcion:
        obj = EstudianteSalida.objects.create(
            salida_id=inscripcion.salida_id,
            usuario_id=inscripcion.usuario_id,
            foto_ficha=inscripcion.foto_ficha,
            firma_digital=inscripcion.firma_digital,
            estado=inscripcion.estado.value,
        )
        return self._to_domain(obj)

    def buscar_inscripcion(self, salida_id: int, usuario_id: int) -> Optional[EstudianteInscripcion]:
        try:
            obj = EstudianteSalida.objects.get(salida_id=salida_id, usuario_id=usuario_id)
            return self._to_domain(obj)
        except EstudianteSalida.DoesNotExist:
            return None

    def listar_inscritos(self, salida_id: int) -> List[dict]:
        from modulos.Usuarios.infraestructura.models import UsuarioModel

        inscritos = EstudianteSalida.objects.filter(salida_id=salida_id).order_by('fecha_inscripcion')
        resultado = []
        for ins in inscritos:
            try:
                u = UsuarioModel.objects.get(pk=ins.usuario_id)
                nombre = f"{u.nombre} {u.apellido}"
                email  = u.email
                programa = getattr(u, 'programa', '')
            except Exception:
                nombre = f"Usuario {ins.usuario_id}"
                email  = ''
                programa = ''

            resultado.append({
                'inscripcion_id': ins.id,
                'usuario_id':     ins.usuario_id,
                'nombre':         nombre,
                'email':          email,
                'programa':       programa,
                'foto_ficha':     ins.foto_ficha.url if ins.foto_ficha else None,
                'firma_digital':  ins.firma_digital.url if ins.firma_digital else None,
                'estado':         ins.estado,
                'fecha_inscripcion': str(ins.fecha_inscripcion),
            })
        return resultado

    def cambiar_estado(self, inscripcion_id: int, nuevo_estado: str) -> EstudianteInscripcion:
        obj = EstudianteSalida.objects.get(pk=inscripcion_id)
        obj.estado = nuevo_estado
        obj.save()
        return self._to_domain(obj)

    # ── Mapper ───────────────────────────────────────────────────────────────

    def _to_domain(self, obj: EstudianteSalida) -> EstudianteInscripcion:
        return EstudianteInscripcion(
            id=EstudianteInscripcionId(obj.id),
            salida_id=obj.salida_id,
            usuario_id=obj.usuario_id,
            foto_ficha=obj.foto_ficha.url if obj.foto_ficha else None,
            firma_digital=obj.firma_digital.url if obj.firma_digital else None,
            estado=EstudianteEstado(obj.estado),
            fecha_inscripcion=str(obj.fecha_inscripcion),
        )

    # ── Dashboard Estudiante ──────────────────────────────────────────────────

    def listar_salidas_estudiante(self, usuario_id: int) -> List[dict]:
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo
        inscripciones = EstudianteSalida.objects.filter(usuario_id=usuario_id).order_by('-fecha_inscripcion')
        resultado = []
        for ins in inscripciones:
            try:
                salida = SalidaModelo.objects.get(pk=ins.salida_id)
                resultado.append({
                    'salida_id': salida.id,
                    'codigo': salida.codigo,
                    'nombre': salida.nombre,
                    'asignatura': salida.asignatura,
                    'fecha_inicio': str(salida.fecha_inicio) if salida.fecha_inicio else None,
                    'fecha_fin': str(salida.fecha_fin) if salida.fecha_fin else None,
                    'estado_inscripcion': 'Pre embarque' if ins.estado == 'pendiente' else ins.estado.capitalize(),
                    'fecha_inscripcion': str(ins.fecha_inscripcion),
                    'icono': salida.icono or 'IcoMountain',
                    'color': salida.color or '#16a34a'
                })
            except SalidaModelo.DoesNotExist:
                continue
        return resultado

    def subir_documento(self, usuario_id: int, tipo_documento: str, archivo) -> dict:
        from .models import DocumentoEstudiante
        obj, created = DocumentoEstudiante.objects.get_or_create(
            usuario_id=usuario_id,
            tipo_documento=tipo_documento,
            defaults={'archivo': archivo}
        )
        if not created:
            obj.archivo = archivo
            obj.save()
        return {
            'id': obj.id,
            'tipo_documento': obj.tipo_documento,
            'url': obj.archivo.url if obj.archivo else None,
            'fecha_subida': str(obj.fecha_subida)
        }

    def obtener_documentos(self, usuario_id: int) -> List[dict]:
        from .models import DocumentoEstudiante
        docs = DocumentoEstudiante.objects.filter(usuario_id=usuario_id)
        return [{
            'id': d.id,
            'tipo_documento': d.tipo_documento,
            'url': d.archivo.url if d.archivo else None,
            'fecha_subida': str(d.fecha_subida)
        } for d in docs]
