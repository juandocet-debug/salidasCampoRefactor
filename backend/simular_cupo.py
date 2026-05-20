import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from modulos.Salidas.Core.infraestructura.models import SalidaModelo
from modulos.Salidas.Estudiante.infraestructura.models import EstudianteSalida, DirectorioEstudiante
from modulos.Usuarios.infraestructura.models import UsuarioModel

def run():
    print("Iniciando simulación de inscripciones con datos reales...")
    
    # 1. Buscar una salida en estado aprobada (Logística pendiente)
    salidas = SalidaModelo.objects.filter(estado='aprobada')
    if not salidas.exists():
        # Si no hay, tomamos la primera disponible y la forzamos a este estado para la prueba
        salida = SalidaModelo.objects.first()
        if not salida:
            print("No hay salidas en el sistema para simular.")
            return
        print(f"Forzando estado de salida '{salida.codigo}' a aprobada.")
        salida.estado = 'aprobada'
    else:
        salida = salidas.first()

    # 2. Asignarle un cupo (ej: 10 estudiantes)
    cupo_total = 10
    salida.num_estudiantes = cupo_total
    salida.save()
    print(f"Salida {salida.codigo} ({salida.nombre}) configurada con cupo proyectado de {cupo_total}.")

    # 3. Buscar estudiantes en la BD (UsuarioModel)
    usuarios = list(UsuarioModel.objects.all())
    
    if len(usuarios) < 8:
        print("Aún faltan usuarios. Creando usuarios de prueba automáticamente...")
        # Obtener del directorio
        directorios = DirectorioEstudiante.objects.filter(activo=True)
        for d in directorios:
            if len(usuarios) >= 8:
                break
            # Crear usuario basado en el directorio
            u, created = UsuarioModel.objects.get_or_create(
                email=d.correo,
                defaults={
                    'nombre': d.nombre,
                    'apellido': d.apellido,
                    'password_hash': '1234'
                }
            )
            if created:
                usuarios.append(u)

    # Si aún no hay 8, crear genéricos
    if len(usuarios) < 8:
        for i in range(8 - len(usuarios)):
            u, created = UsuarioModel.objects.get_or_create(
                email=f"estudiante_simulado_{i}@pedagogica.edu.co",
                defaults={
                    'nombre': "Estudiante Simulado",
                    'apellido': str(i),
                    'password_hash': '1234'
                }
            )
            if created:
                usuarios.append(u)

    # 4. Inscribir al 80% (8 estudiantes)
    EstudianteSalida.objects.filter(salida_id=salida.id).delete() # Limpiar inscripciones previas
    
    inscritos = 0
    for u in usuarios[:8]:
        EstudianteSalida.objects.create(
            salida_id=salida.id,
            usuario_id=u.id,
            estado='autorizado'
        )
        inscritos += 1
        
    print(f"Se inscribieron {inscritos} estudiantes exitosamente (equivale al {inscritos/cupo_total*100}% del cupo).")
    print("Simulación completada. Ya deberías ver esta salida en el panel del Coordinador de Logística.")

if __name__ == '__main__':
    run()
