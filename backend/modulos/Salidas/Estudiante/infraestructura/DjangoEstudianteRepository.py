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
                cedula=obj.cedula, telefono=obj.telefono,
                rol=getattr(obj, 'rol', 'estudiante'),
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
                        'cedula':   fila.get('cedula', '').strip() or None,
                        'telefono': fila.get('telefono', '').strip() or None,
                        'facultad': fila.get('facultad', '').strip(),
                        'programa': fila.get('programa', '').strip(),
                        'rol':      fila.get('rol', 'estudiante').strip().lower() or 'estudiante',
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

    def listar_directorio_activo(self) -> List[dict]:
        try:
            carga_activa = CargaDirectorio.objects.filter(activa=True).latest('fecha_carga')
            estudiantes = DirectorioEstudiante.objects.filter(carga=carga_activa)
            return list(estudiantes.values('id', 'correo', 'nombre', 'apellido', 'cedula', 'telefono', 'facultad', 'programa', 'rol', 'activo'))
        except CargaDirectorio.DoesNotExist:
            return []

    def actualizar_estudiante_directorio(self, estudiante_id: int, datos: dict) -> DirectorioEstudianteEntidad:
        try:
            obj = DirectorioEstudiante.objects.get(id=estudiante_id)
            if 'correo' in datos: obj.correo = datos['correo']
            if 'nombre' in datos: obj.nombre = datos['nombre']
            if 'apellido' in datos: obj.apellido = datos['apellido']
            if 'facultad' in datos: obj.facultad = datos['facultad']
            if 'programa' in datos: obj.programa = datos['programa']
            if 'cedula' in datos: obj.cedula = datos['cedula']
            if 'telefono' in datos: obj.telefono = datos['telefono']
            if 'rol' in datos: obj.rol = datos['rol']
            if 'activo' in datos: obj.activo = datos['activo']
            if 'password_hash' in datos: obj.password_hash = datos['password_hash']
            obj.save()
            
            return DirectorioEstudianteEntidad(
                id=obj.id, correo=obj.correo, password_hash=obj.password_hash,
                nombre=obj.nombre, apellido=obj.apellido,
                facultad=obj.facultad, programa=obj.programa,
                cedula=obj.cedula, telefono=obj.telefono,
                rol=getattr(obj, 'rol', 'estudiante'),
                activo=obj.activo, carga_id=obj.carga_id
            )
        except DirectorioEstudiante.DoesNotExist:
            raise ValueError("Estudiante no encontrado en el directorio.")

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

    def validar_pertenencia(self, salida_id: int, usuario_id: int) -> None:
        from modulos.Salidas.Core.infraestructura.models import SalidaModelo
        from modulos.Usuarios.infraestructura.models import UsuarioModel
        from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
        from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel
        
        try:
            salida = SalidaModelo.objects.get(pk=salida_id)
            usuario = UsuarioModel.objects.get(pk=usuario_id)
        except Exception:
            raise ValueError(f"Salida #{salida_id} no encontrada. Verifica el código e inténtalo de nuevo.")

        # Buscar los datos del estudiante en el CSV activo
        dir_estudiante = self.buscar_en_directorio(usuario.email)
        if not dir_estudiante:
            raise ValueError("El estudiante no está en el directorio institucional activo.")

        # Validar Facultad
        if salida.facultad_id:
            try:
                facultad_sys = FacultadModel.objects.get(pk=salida.facultad_id)
                fac_sys_name = (facultad_sys.nombre or "").strip().lower()
                fac_csv_name = (dir_estudiante.facultad or "").strip().lower()
                if fac_sys_name != fac_csv_name:
                    raise ValueError(f"No perteneces a la facultad de la salida ({fac_sys_name.title()}). Tu facultad es {fac_csv_name.title()}.")
            except FacultadModel.DoesNotExist:
                pass

        # Validar Programa
        if salida.programa_id:
            try:
                prog_sys = ProgramaModel.objects.get(pk=salida.programa_id)
                prog_sys_name = (prog_sys.nombre or "").strip().lower()
                prog_csv_name = (dir_estudiante.programa or "").strip().lower()
                if prog_sys_name != prog_csv_name:
                    raise ValueError(f"No perteneces al programa de la salida ({prog_sys_name.title()}). Tu programa es {prog_csv_name.title()}.")
            except ProgramaModel.DoesNotExist:
                pass

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
        from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
        from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel
        
        inscripciones = EstudianteSalida.objects.filter(usuario_id=usuario_id).order_by('-fecha_inscripcion')
        resultado = []
        
        # Cache para no consultar en cada iteración
        facultades_cache = {}
        programas_cache = {}
        
        for ins in inscripciones:
            try:
                salida = SalidaModelo.objects.get(pk=ins.salida_id)
                
                fac_nombre = ""
                if salida.facultad_id:
                    if salida.facultad_id not in facultades_cache:
                        fac_obj = FacultadModel.objects.filter(id=salida.facultad_id).first()
                        facultades_cache[salida.facultad_id] = fac_obj.nombre if fac_obj else ""
                    fac_nombre = facultades_cache.get(salida.facultad_id, "")
                    
                prog_nombre = ""
                if salida.programa_id:
                    if salida.programa_id not in programas_cache:
                        prog_obj = ProgramaModel.objects.filter(id=salida.programa_id).first()
                        programas_cache[salida.programa_id] = prog_obj.nombre if prog_obj else ""
                    prog_nombre = programas_cache.get(salida.programa_id, "")
                    
                resultado.append({
                    'salida_id': salida.id,
                    'codigo': salida.codigo,
                    'nombre': salida.nombre,
                    'asignatura': salida.asignatura,
                    'semestre': salida.semestre,
                    'facultad': fac_nombre,
                    'programa': prog_nombre,
                    'fecha_inicio': str(salida.fecha_inicio) if salida.fecha_inicio else None,
                    'fecha_fin': str(salida.fecha_fin) if salida.fecha_fin else None,
                    'hora_inicio': str(salida.hora_inicio) if salida.hora_inicio else None,
                    'hora_fin': str(salida.hora_fin) if salida.hora_fin else None,
                    'punto_partida': salida.punto_partida,
                    'parada_max': salida.parada_max,
                    'num_estudiantes': salida.num_estudiantes,
                    'justificacion': salida.justificacion,
                    'objetivo_general': salida.objetivo_general,
                    'objetivos_especificos': salida.objetivos_especificos,
                    'estrategia_metodologica': salida.estrategia_metodologica,
                    'criterios_evaluacion': salida.criterios_evaluacion,
                    'productos_esperados': salida.productos_esperados,
                    'resumen': salida.resumen,
                    'relacion_syllabus': salida.relacion_syllabus,
                    'distancia_total_km': str(salida.distancia_total_km),
                    'duracion_dias': str(salida.duracion_dias),
                    'horas_viaje': str(salida.horas_viaje),
                    'costo_estimado': str(salida.costo_estimado),
                    'estado_inscripcion': 'Pre embarque' if ins.estado == 'pendiente' else ins.estado.capitalize(),
                    'estado_salida': salida.estado,
                    'nota_cambio': salida.nota_cambio,
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

    def tiene_documentos_obligatorios(self, usuario_id: int) -> bool:
        from .models import DocumentoEstudiante
        # Buscar si existen documentos de tipo 'eps' y 'documento_identidad'
        tipos_subidos = DocumentoEstudiante.objects.filter(
            usuario_id=usuario_id, 
            tipo_documento__in=['eps', 'documento_identidad']
        ).values_list('tipo_documento', flat=True)
        
        return 'eps' in tipos_subidos and 'documento_identidad' in tipos_subidos

    def eliminar_documento(self, usuario_id: int, tipo_documento: str) -> None:
        from .models import DocumentoEstudiante
        try:
            doc = DocumentoEstudiante.objects.get(usuario_id=usuario_id, tipo_documento=tipo_documento)
            if doc.archivo:
                doc.archivo.delete()
            doc.delete()
        except DocumentoEstudiante.DoesNotExist:
            pass
