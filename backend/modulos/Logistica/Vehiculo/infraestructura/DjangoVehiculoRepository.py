from ....Logistica.Vehiculo.dominio.Vehiculo import Vehiculo
from ....Logistica.Vehiculo.dominio.VehiculoId import VehiculoId
from ....Logistica.Vehiculo.dominio.VehiculoPlaca import VehiculoPlaca
from ....Logistica.Vehiculo.dominio.VehiculoRepository import VehiculoRepository
from .models import VehiculoModel
from typing import List, Optional
from datetime import date

class DjangoVehiculoRepository(VehiculoRepository):
    
    def _to_domain(self, model: VehiculoModel) -> Vehiculo:
        try:
            foto_url_str = model.foto_url.url if model.foto_url else None
        except ValueError:
            foto_url_str = None
        return Vehiculo(
            id=VehiculoId(str(model.id)),
            placa=VehiculoPlaca(model.placa),
            tipo=model.tipo,
            marca=model.marca,
            modelo=model.modelo,
            anio=model.anio,
            color=model.color,
            numero_interno=model.numero_interno,
            capacidad=model.capacidad,
            rendimiento_kmgal=model.rendimiento_kmgal,
            tipo_combustible=model.tipo_combustible,
            propietario=model.propietario,
            estado_tecnico=model.estado_tecnico,
            notas=model.notas,
            foto_url=foto_url_str
        )

    def save(self, vehiculo: Vehiculo) -> Vehiculo:
        # Tratamos foto_url: si es texto, se ignora/asigna, si es un archivo se maneja en el request
        # Aquí save recibe datos puros (strings). Las fotos (Files) no se pasan fácilmente por el dominio puro a FileField
        # Pero Django Model maneja strings si es path, o Files.
        
        defaults = {
            'placa': vehiculo.placa.value,
            'tipo': vehiculo.tipo,
            'marca': vehiculo.marca,
            'modelo': vehiculo.modelo,
            'anio': vehiculo.anio,
            'color': vehiculo.color,
            'numero_interno': vehiculo.numero_interno,
            'capacidad': vehiculo.capacidad,
            'rendimiento_kmgal': vehiculo.rendimiento_kmgal,
            'tipo_combustible': vehiculo.tipo_combustible,
            'propietario': vehiculo.propietario,
            'estado_tecnico': vehiculo.estado_tecnico,
            'notas': vehiculo.notas,
        }
        
        # Para la foto_url (si viene algo nuevo o si se limpió)
        if vehiculo.foto_url is None:
            defaults['foto_url'] = None
        elif vehiculo.foto_url and not isinstance(vehiculo.foto_url, str):
            defaults['foto_url'] = vehiculo.foto_url 

        obj, created = VehiculoModel.objects.update_or_create(
            id=vehiculo.id.value,
            defaults=defaults
        )
        return self._to_domain(obj)

    def get_all(self, filtros: dict = None) -> List[Vehiculo]:
        qs = VehiculoModel.objects.all()
        if filtros:
            if 'tipo' in filtros:
                qs = qs.filter(tipo=filtros['tipo'])
            if 'propietario' in filtros:
                qs = qs.filter(propietario=filtros['propietario'])
            
            # ─── Filtro de disponibilidad por fechas ─────────────────────────
            # Si se pasan fecha_inicio y fecha_fin, excluir vehículos cuyas placas
            # ya estén en asignaciones de otras salidas que se traslapen en ese período.
            if 'fecha_inicio' in filtros and 'fecha_fin' in filtros:
                try:
                    from modulos.Salidas.Core.infraestructura.models import SalidaModelo, AsignacionExternaLogistica
                    fi = filtros['fecha_inicio']  # ya es objeto date
                    ff = filtros['fecha_fin']
                    salida_excluida_id = filtros.get('salida_id')  # la salida actual (para no excluirla a si misma)

                    # Salidas que se solapan con el rango: inicio <= ff AND fin >= fi
                    salidas_en_conflicto = SalidaModelo.objects.filter(
                        fecha_inicio__lte=ff,
                        fecha_fin__gte=fi
                    )
                    if salida_excluida_id:
                        salidas_en_conflicto = salidas_en_conflicto.exclude(id=salida_excluida_id)

                    ids_en_conflicto = list(salidas_en_conflicto.values_list('id', flat=True))

                    # Asignaciones de esas salidas (empresa almacena la placa como string concatenado)
                    asignaciones = AsignacionExternaLogistica.objects.filter(
                        salida_id__in=ids_en_conflicto
                    ).values_list('empresa', flat=True)

                    # Extraer placas del string de empresa ("Flota UPN (ADFA / GJGJH)")
                    import re
                    placas_ocupadas = set()
                    for emp_str in asignaciones:
                        # Extraer lo que está dentro del paréntesis de Flota UPN
                        match_flota = re.search(r'Flota UPN \((.+?)\)', emp_str)
                        if match_flota:
                            for p in match_flota.group(1).split(' / '):
                                placas_ocupadas.add(p.strip())

                    if placas_ocupadas:
                        qs = qs.exclude(placa__in=placas_ocupadas)
                        print(f"[LOG] Placas ocupadas en rango {fi} - {ff}: {placas_ocupadas}")
                except Exception as e:
                    print(f"[WARN] Error al filtrar por disponibilidad de fechas: {e}")

        return [self._to_domain(v) for v in qs]

    def get_by_id(self, vehiculo_id: VehiculoId) -> Optional[Vehiculo]:
        try:
            model = VehiculoModel.objects.get(id=vehiculo_id.value)
            return self._to_domain(model)
        except VehiculoModel.DoesNotExist:
            return None

    def delete(self, vehiculo_id: VehiculoId) -> None:
        VehiculoModel.objects.filter(id=vehiculo_id.value).delete()
