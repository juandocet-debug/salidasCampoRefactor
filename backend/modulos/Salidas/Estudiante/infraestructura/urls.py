from django.urls import path
from .EstudianteController import EstudianteLoginController, EstudianteInscripcionController, EstudianteMisSalidasController, EstudianteDocumentosController
from .ProfesorInscritosController import ProfesorInscritosController
from .CargaDirectorioController import CargaDirectorioController, CargaDirectorioDetalleController

urlpatterns = [
    # ── Autenticación del Estudiante (público) ─────────────────────────────
    path('auth/estudiante/login/', EstudianteLoginController.as_view(), name='estudiante-login'),

    # ── Inscripción del Estudiante ─────────────────────────────────────────
    path('estudiante/salidas/<int:salida_id>/inscribirse/',
         EstudianteInscripcionController.as_view(), name='estudiante-inscribirse'),

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
]
