from django.core.exceptions import ObjectDoesNotExist
from ...ConductorInstitucional.infraestructura.models import ConductorInstitucionalModel
from ....Salidas.Core.infraestructura.models import SalidaModelo
from ...ConductorInstitucional.dominio.IConductorAppRepository import IConductorAppRepository

class DjangoConductorAppRepository(IConductorAppRepository):
    def login(self, cedula: str, telefono: str) -> dict:
        try:
            # Autenticación simple buscando coincidencia exacta de cédula y teléfono (o solo cédula si es flexible)
            conductor = ConductorInstitucionalModel.objects.get(cedula=cedula)
            
            # TODO: Idealmente se debería validar el teléfono o algún pin de seguridad
            # if conductor.telefono != telefono: raise ValueError("Teléfono incorrecto")

            if not conductor.activo:
                raise ValueError("El conductor se encuentra inactivo en el sistema.")

            return {
                'id': str(conductor.id),
                'nombre': conductor.nombre,
                'cedula': conductor.cedula,
                'telefono': conductor.telefono,
                'licencia': conductor.tipo_licencia,
                'foto': conductor.foto.url if conductor.foto else None,
                'rol': 'conductor'
            }
        except ObjectDoesNotExist:
            raise ValueError("No se encontró un conductor con esta cédula.")

    def get_mis_viajes(self, conductor_id: str) -> list:
        nombre_conductor = ""
        try:
            conductor = ConductorInstitucionalModel.objects.get(id=conductor_id)
            nombre_conductor = conductor.nombre
        except ObjectDoesNotExist:
            from ....Logistica.ConductorExterno.infraestructura.models import ConductorExternoModel
            try:
                conductor = ConductorExternoModel.objects.get(id=conductor_id)
                nombre_conductor = conductor.nombre
            except ObjectDoesNotExist:
                from ....Usuarios.infraestructura.models import UsuarioModel
                try:
                    usuario = UsuarioModel.objects.get(id=conductor_id)
                    nombre_conductor = usuario.nombre
                except ObjectDoesNotExist:
                    raise ValueError("Conductor no encontrado.")
            
        try:
            from ....Salidas.Core.infraestructura.models import AsignacionExternaLogistica
            # Buscar salidas donde el nombre del conductor esté en el contacto de AsignacionExternaLogistica
            asignaciones = AsignacionExternaLogistica.objects.filter(contacto__icontains=nombre_conductor)
            salida_ids = [a.salida_id for a in asignaciones]
            
            viajes = SalidaModelo.objects.filter(
                id__in=salida_ids,
                estado__in=['lista_ejecucion', 'preembarque', 'en_ejecucion', 'finalizada']
            ).order_by('fecha_inicio')

            from modulos.Catalogos.Facultad.infraestructura.models import FacultadModel
            from modulos.Catalogos.Programa.infraestructura.models import ProgramaModel
            facultades_cache = {}
            programas_cache = {}

            resultado = []
            for v in viajes:
                fac_nombre = ""
                prog_nombre = ""
                
                if v.facultad_id:
                    if v.facultad_id not in facultades_cache:
                        fac_obj = FacultadModel.objects.filter(id=v.facultad_id).first()
                        facultades_cache[v.facultad_id] = fac_obj.nombre if fac_obj else ""
                    fac_nombre = facultades_cache[v.facultad_id]

                if v.programa_id:
                    if v.programa_id not in programas_cache:
                        prog_obj = ProgramaModel.objects.filter(id=v.programa_id).first()
                        programas_cache[v.programa_id] = prog_obj.nombre if prog_obj else ""
                    prog_nombre = programas_cache[v.programa_id]

                resultado.append({
                    'id': str(v.id),
                    'codigo': v.codigo,
                    'nombre': v.nombre,
                    'asignatura': v.asignatura,
                    'facultad': fac_nombre,
                    'programa': prog_nombre,
                'punto_partida': v.punto_partida,
                'destino': v.parada_max,
                'fecha_salida': v.fecha_inicio,
                'fecha_regreso': v.fecha_fin,
                'hora_salida': str(v.hora_inicio) if v.hora_inicio else None,
                'hora_regreso': str(v.hora_fin) if v.hora_fin else None,
                    'estado': v.estado,
                    'color': v.color,
                    'icono': v.icono,
                })
            
            return resultado

        except ObjectDoesNotExist:
            raise ValueError("Conductor no encontrado.")

    def comentar_parada_itinerario(self, conductor_id: str, parada_id: int, comentario: str) -> None:
        from ....Salidas.Itinerario.Parada.infraestructura.models import ParadaModelo
        try:
            parada = ParadaModelo.objects.get(id=parada_id)
            # In a real scenario, we should verify the driver is assigned to the trip of this parada.
            parada.notas_itinerario = comentario
            parada.save()
        except ParadaModelo.DoesNotExist:
            raise ValueError("Parada no encontrada.")

    def reportar_novedad(self, conductor_id: str, salida_id: int, nivel: str, mensaje: str, foto: str = None) -> None:
        from ....Salidas.Core.infraestructura.models import NovedadOperativa, SalidaModelo
        import base64
        from django.core.files.base import ContentFile
        
        novedad = NovedadOperativa(
            salida_id=salida_id,
            nivel=nivel,
            mensaje=mensaje
        )
        
        if foto and foto.startswith('data:image'):
            try:
                format, imgstr = foto.split(';base64,') 
                ext = format.split('/')[-1]
                data = ContentFile(base64.b64decode(imgstr), name=f'novedad_{salida_id}_{conductor_id}.{ext}')
                novedad.foto = data
            except Exception as e:
                print(f"Error procesando imagen: {e}")
                
        novedad.save()
        
        # Automatización de urgencia si falta el itinerario
        if nivel in ['alta', 'critica'] and "itinerario" in mensaje.lower():
            SalidaModelo.objects.filter(id=salida_id).update(
                color='#ef4444',
                icono='IcoAlert',
                nota_cambio='URGENTE: Conductor reporta falta de itinerario. Revisar de inmediato.'
            )

    def notificar_llegada_punto(self, conductor_id: str, salida_id: int) -> None:
        from ....Salidas.Core.infraestructura.models import SalidaModelo, NovedadOperativa
        from django.utils import timezone
        
        now = timezone.now()
        
        modificados = SalidaModelo.objects.filter(id=salida_id).update(
            estado='en_ejecucion',
            color='#10b981',
            icono='IcoBus',
            nota_cambio=f'Vehículo en punto de encuentro ({now.strftime("%H:%M")}).'
        )
        
        if modificados > 0:
            NovedadOperativa.objects.create(
                salida_id=salida_id,
                nivel='baja',
                mensaje=f'Llegada al punto de encuentro notificada por el conductor a las {now.strftime("%H:%M")}.'
            )
        else:
            raise ValueError("No se pudo actualizar el estado de la salida.")

    def finalizar_viaje(self, conductor_id: str, salida_id: int) -> None:
        from ....Salidas.Core.infraestructura.models import SalidaModelo, NovedadOperativa
        from django.utils import timezone
        
        now = timezone.now()
        
        modificados = SalidaModelo.objects.filter(id=salida_id).update(
            estado='finalizada',
            color='#64748b',
            icono='IcoChecklist',
            nota_cambio=f'Viaje finalizado exitosamente ({now.strftime("%H:%M")}).'
        )
        
        if modificados > 0:
            NovedadOperativa.objects.create(
                salida_id=salida_id,
                nivel='baja',
                mensaje=f'Viaje finalizado por el conductor a las {now.strftime("%H:%M")}.'
            )
        else:
            raise ValueError("No se pudo finalizar la salida.")
