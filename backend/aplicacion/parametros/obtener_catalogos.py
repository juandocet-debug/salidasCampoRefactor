# CAPA: Aplicación
# QUÉ HACE: Caso de uso para obtener catálogos (facultades, programas, ventanas)
# NO DEBE CONTENER: Django, ORM

class ObtenerCatalogosCasoUso:
    def __init__(self, repo_facultad, repo_programa, repo_ventana):
        self.repo_facultad = repo_facultad
        self.repo_programa = repo_programa
        self.repo_ventana = repo_ventana

    def ejecutar(self):
        return {
            'facultades': self.repo_facultad.listar_activas(),
            'programas': self.repo_programa.listar_activos(),
            'ventanas': self.repo_ventana.listar_activas()
        }
