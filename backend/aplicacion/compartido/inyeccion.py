from aplicacion.compartido.autenticar import AutenticarUsuarioCasoUso
from infraestructura.usuarios.servicio import AutenticacionServicioDjango

def proveer_autenticar_usuario():
    return AutenticarUsuarioCasoUso(AutenticacionServicioDjango())
