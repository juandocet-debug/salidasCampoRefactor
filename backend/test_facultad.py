import os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from modulos.Catalogos.Facultad.infraestructura.DjangoFacultadRepository import DjangoFacultadRepository
from modulos.Catalogos.Facultad.aplicacion.FacultadCreate.FacultadCreate import FacultadCreate

repo = DjangoFacultadRepository()
caso_uso = FacultadCreate(repository=repo)

try:
    caso_uso.run(nombre="Ciencias", activa=True)
    print("Facultad creada exitosamente!")
except Exception as e:
    print(f"ERROR DURANTE CREACION: {type(e).__name__} - {str(e)}")
    import traceback
    traceback.print_exc()
