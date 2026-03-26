from modulos.Logistica.Parametro.dominio.ParametroRepository import ParametroRepository

class ParametroGetConfiguracion:
    def __init__(self, repository: ParametroRepository):
        self.repository = repository

    def run(self) -> dict:
        todos = self.repository.get_all()
        
        # Valores base obligatorios
        datos = {
            "precio_galon": 10000,
            "costo_noche": 150000,
            "costo_hora_extra": 10000,
            "costo_hora_extra_2": 15000,
            "max_horas_viaje": 8,
            "horas_buffer": 2
        }
        
        # Mezclar con los registrados en base de datos
        for parametro in todos:
            try:
                datos[parametro.clave.value] = float(parametro.valor.value)
            except (ValueError, TypeError):
                datos[parametro.clave.value] = parametro.valor.value
                
        return datos
