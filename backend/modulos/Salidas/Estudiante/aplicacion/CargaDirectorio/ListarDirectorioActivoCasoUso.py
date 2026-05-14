class ListarDirectorioActivoCasoUso:
    def __init__(self, repository):
        self.repository = repository

    def ejecutar(self) -> list:
        return self.repository.listar_directorio_activo()
