from django.contrib.auth.hashers import make_password

class EditarEstudianteDirectorioCasoUso:
    def __init__(self, repository):
        self.repository = repository

    def ejecutar(self, estudiante_id: int, datos: dict) -> dict:
        if 'password' in datos and datos['password']:
            datos['password_hash'] = make_password(datos['password'])
            del datos['password']
            
        estudiante = self.repository.actualizar_estudiante_directorio(estudiante_id, datos)
        return {
            "id": estudiante.id,
            "correo": estudiante.correo,
            "nombre": estudiante.nombre,
            "apellido": estudiante.apellido,
            "cedula": getattr(estudiante, 'cedula', None),
            "telefono": getattr(estudiante, 'telefono', None),
            "facultad": estudiante.facultad,
            "programa": estudiante.programa,
            "rol": getattr(estudiante, 'rol', 'estudiante'),
            "activo": estudiante.activo
        }
