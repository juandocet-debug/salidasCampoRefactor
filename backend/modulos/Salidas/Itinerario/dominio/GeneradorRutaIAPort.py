import abc

class GeneradorRutaIAPort(abc.ABC):
    @abc.abstractmethod
    def consultar_asistencia_ruta(self, contexto_ruta: str) -> str:
        """
        Retorna los comentarios / análisis topográfico de la I.A. 
        gemini/llama dada una descripción o puntos de la ruta del mapa.
        """
        pass

    @abc.abstractmethod
    def extraer_municipios_ruta(self, inicio: str, fin: str, instrucciones: str) -> list:
        """
        Extrae un array de nombres de los municipios recorridos 
        entre el punto de inicio y el fin.
        """
        pass
