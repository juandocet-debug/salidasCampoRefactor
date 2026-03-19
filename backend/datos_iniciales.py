# datos_iniciales.py
# Pobla la base de datos con usuarios de demo, parametros y vehiculos.
# Ejecutar: python datos_iniciales.py

import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configuracion.settings.desarrollo')
django.setup()

from aplicaciones.usuarios.modelos import Usuario
from aplicaciones.parametros.modelos import ParametrosSistema
from aplicaciones.transporte.modelos import Vehiculo
from aplicaciones.salidas.modelos import Salida
from aplicaciones.nucleo.constantes import Roles

CONTRASENA = 'otium2026'

USUARIOS_DEMO = [
    {'email': 'profesor@upn.edu.co',        'first_name': 'Ana',    'last_name': 'Martinez',  'rol': Roles.PROFESOR},
    {'email': 'coord.academico@upn.edu.co', 'first_name': 'Carlos', 'last_name': 'Rivera',    'rol': Roles.COORDINADOR_ACADEMICO},
    {'email': 'consejo@upn.edu.co',         'first_name': 'Sofia',  'last_name': 'Herrera',   'rol': Roles.CONSEJO},
    {'email': 'coord.salidas@upn.edu.co',   'first_name': 'Luis',   'last_name': 'Gomez',     'rol': Roles.COORDINADOR_SALIDAS},
    {'email': 'conductor@upn.edu.co',       'first_name': 'Jorge',  'last_name': 'Ramirez',   'rol': Roles.CONDUCTOR},
    {'email': 'estudiante@upn.edu.co',      'first_name': 'Maria',  'last_name': 'Lopez',     'rol': Roles.ESTUDIANTE},
]

VEHICULOS_DEMO = [
    {'placa': 'ABC-123', 'tipo': 'bus',       'capacidad': 40},
    {'placa': 'XYZ-456', 'tipo': 'buseta',    'capacidad': 20},
    {'placa': 'LMN-789', 'tipo': 'camioneta', 'capacidad': 10},
]


def crear_usuarios():
    print('\n[USUARIOS] Creando usuarios de demo...')
    for datos in USUARIOS_DEMO:
        if not Usuario.objects.filter(email=datos['email']).exists():
            u = Usuario(**datos)
            u.set_password(CONTRASENA)
            u.save()
            print('   OK   ' + datos['rol'].ljust(25) + ' -> ' + datos['email'])
        else:
            print('   SKIP ' + datos['email'] + ' (ya existe)')


def crear_parametros():
    print('\n[PARAMETROS] Configurando parametros del sistema...')
    params, creado = ParametrosSistema.objects.get_or_create(id=1)
    if creado:
        print('   OK   Pg=%s | R=%s | Noche=%s | Hora=%s' % (
            params.precio_galon, params.rendimiento,
            params.costo_noche, params.costo_hora_extra))
    else:
        print('   SKIP Parametros ya existen')


def crear_vehiculos():
    print('\n[VEHICULOS] Creando vehiculos de demo...')
    for datos in VEHICULOS_DEMO:
        _, creado = Vehiculo.objects.get_or_create(placa=datos['placa'], defaults=datos)
        marca = 'OK  ' if creado else 'SKIP'
        print('   ' + marca + ' ' + datos['tipo'].ljust(12) + ' ' + datos['placa'])


def crear_salida_demo():
    print('\n[SALIDAS] Creando salida de campo de ejemplo...')
    try:
        profesor = Usuario.objects.get(email='profesor@upn.edu.co')
    except Usuario.DoesNotExist:
        print('   ERROR No se encontro el usuario profesor')
        return

    if not Salida.objects.filter(profesor=profesor).exists():
        Salida.objects.create(
            nombre='Visita al Jardin Botanico de Bogota',
            asignatura='Educacion Ambiental',
            semestre='2026-1',
            programa='Licenciatura en Biologia',
            num_estudiantes=35,
            justificacion='Salida de reconocimiento de flora nativa de la sabana de Bogota.',
            tipo_transporte='propio',
            profesor=profesor,
        )
        print('   OK   Salida de ejemplo creada')
    else:
        print('   SKIP Ya existe una salida para este profesor')


def main():
    sep = '=' * 55
    print(sep)
    print('  OTIUM -- Datos Iniciales de Demo')
    print('  Contrasena de todos los usuarios: ' + CONTRASENA)
    print(sep)

    crear_usuarios()
    crear_parametros()
    crear_vehiculos()
    crear_salida_demo()

    print('\n' + sep)
    print('  [OK] Datos iniciales creados correctamente!')
    print('  Ejecuta: python manage.py runserver')
    print(sep)


if __name__ == '__main__':
    main()
