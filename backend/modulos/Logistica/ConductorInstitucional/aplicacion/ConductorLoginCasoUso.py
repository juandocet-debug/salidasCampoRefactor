from ..dominio.IConductorAppRepository import IConductorAppRepository

class ConductorLoginCasoUso:
    def __init__(self, repository: IConductorAppRepository):
        self.repository = repository

    def run(self, cedula: str, telefono: str) -> dict:
        if not cedula:
            raise ValueError("La cédula es requerida para ingresar.")
        return self.repository.login(cedula, telefono)
