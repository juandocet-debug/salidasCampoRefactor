from django.urls import path
from .EstudianteController import EstudianteLoginController, EstudianteInscripcionController, EstudianteMisSalidasController, EstudianteDocumentosController, EstudianteCodigoController
from .ProfesorInscritosController import ProfesorInscritosController
from .CargaDirectorioController import CargaDirectorioController, CargaDirectorioDetalleController
from .DirectorioActivoController import DirectorioActivoController, DirectorioEstudianteEditController

urlpatterns = [
    # ── Autenticación Unificada (público) ─────────────────────────────
    path('auth/mobile/login/', EstudianteLoginController.as_view(), name='mobile-login'),

    # ── Inscripción del Estudiante ─────────────────────────────────────────
    path('estudiante/salidas/<str:salida_id>/inscribirse/',
         EstudianteInscripcionController.as_view(), name='estudiante-inscribirse'),
    path('estudiante/salidas/pin/<str:pin>/', EstudianteCodigoController.as_view(), name='estudiante-salida-pin'),

    # ── Dashboard del Estudiante ───────────────────────────────────────────
    path('estudiante/mis-salidas/', EstudianteMisSalidasController.as_view(), name='estudiante-mis-salidas'),
    path('estudiante/mis-documentos/', EstudianteDocumentosController.as_view(), name='estudiante-mis-documentos'),

    # ── Panel del Profesor: listar inscritos ───────────────────────────────
    path('profesor/salidas/<int:salida_id>/inscritos/',
         ProfesorInscritosController.as_view(), name='profesor-inscritos'),

    # ── Panel del Profesor: autorizar/rechazar ─────────────────────────────
    path('profesor/salidas/<int:salida_id>/inscritos/<int:inscripcion_id>/estado/',
         ProfesorInscritosController.as_view(), name='profesor-estado-inscripcion'),

    # ── Admin: cargar directorio CSV ───────────────────────────────────────
    path('admin/directorio/', CargaDirectorioController.as_view(), name='admin-directorio'),
    path('admin/directorio/<int:pk>/', CargaDirectorioDetalleController.as_view(), name='admin-directorio-detalle'),

    # ── Admin: Ver y editar directorio activo ──────────────────────────────
    path('admin/directorio/activos/', DirectorioActivoController.as_view(), name='admin-directorio-activos'),
    path('admin/directorio/estudiantes/<int:pk>/', DirectorioEstudianteEditController.as_view(), name='admin-directorio-estudiantes-edit'),
]
