"""
LoginEstudianteCasoUso
─────────────────────
Orquesta el login de un estudiante contra el directorio institucional (CSV).
Flujo:
  1. Busca el correo en el directorio activo.
  2. Verifica la contraseña contra el hash almacenado.
  3. Si todo OK → busca/crea el UsuarioModel local con rol='estudiante'.
  4. Retorna los datos del estudiante para que el controlador genere el JWT.
"""
from modulos.Salidas.Estudiante.dominio.IEstudianteRepository import IEstudianteRepository


class LoginEstudianteCasoUso:
    def __init__(self, repo: IEstudianteRepository):
        self.repo = repo

    def ejecutar(self, correo: str, password_raw: str) -> dict:
        # 1. ¿Existe en el directorio?
        entrada = self.repo.buscar_en_directorio(correo)
        if not entrada:
            raise ValueError(
                "No encontrado en el directorio estudiantil activo. "
                "Contacta a la Oficina de Registro."
            )

        # 2. ¿La contraseña es correcta?
        if not self.repo.verificar_password_directorio(correo, password_raw):
            raise ValueError("Correo o contraseña incorrectos.")

        # 3. Retorna datos del directorio — el controlador crea/actualiza UsuarioModel y genera JWT
        return {
            "correo":   entrada.correo,
            "nombre":   entrada.nombre,
            "apellido": entrada.apellido,
            "facultad": entrada.facultad,
            "programa": entrada.programa,
        }
