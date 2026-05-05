import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from modulos.Salidas.Core.dominio.Salida import Salida
from modulos.Salidas.Core.dominio.SalidaId import SalidaId
from modulos.Salidas.Core.dominio.SalidaCodigo import SalidaCodigo
from modulos.Salidas.Core.dominio.SalidaNombre import SalidaNombre
from modulos.Salidas.Core.dominio.SalidaAsignatura import SalidaAsignatura
from modulos.Salidas.Core.dominio.SalidaSemestre import SalidaSemestre
from modulos.Salidas.Core.dominio.FacultadId import FacultadId
from modulos.Salidas.Core.dominio.ProgramaId import ProgramaId
from modulos.Salidas.Core.dominio.SalidaNumEstudiantes import SalidaNumEstudiantes
from modulos.Salidas.Core.dominio.SalidaJustificacion import SalidaJustificacion
from modulos.Salidas.Core.dominio.EstadoSalida import EstadoSalida
from modulos.Salidas.Core.dominio.ProfesorId import ProfesorId
from modulos.Salidas.Core.dominio.SalidaFechaInicio import SalidaFechaInicio
from modulos.Salidas.Core.dominio.SalidaFechaFin import SalidaFechaFin
from modulos.Salidas.Core.dominio.SalidaHoraInicio import SalidaHoraInicio
from modulos.Salidas.Core.dominio.SalidaHoraFin import SalidaHoraFin
from modulos.Salidas.Core.dominio.SalidaDistanciaTotalKm import SalidaDistanciaTotalKm
from modulos.Salidas.Core.dominio.SalidaDuracionDias import SalidaDuracionDias
from modulos.Salidas.Core.dominio.SalidaHorasViaje import SalidaHorasViaje
from modulos.Salidas.Core.dominio.SalidaCostoEstimado import SalidaCostoEstimado
from modulos.Salidas.Core.dominio.SalidaVehiculosAsignados import SalidaVehiculosAsignados

from modulos.Salidas.Core.infraestructura.DjangoSalidaRepository import DjangoSalidaRepository
from modulos.Salidas.Core.aplicacion.SalidaCreate.SalidaCreate import SalidaCreate

repo = DjangoSalidaRepository()
use_case = SalidaCreate(repo)

nueva_salida = use_case.run({'nombre': 'Prueba Automatica'})

import sqlite3
db = sqlite3.connect('otium.sqlite3')
print(db.execute("SELECT id, codigo, estado, nombre FROM salidas_core_salida").fetchall())
