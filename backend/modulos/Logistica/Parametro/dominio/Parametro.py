from dataclasses import dataclass
from typing import Optional
from .ParametroId import ParametroId
from .ParametroClave import ParametroClave
from .ParametroNombre import ParametroNombre
from .ParametroValor import ParametroValor
from .ParametroDescripcion import ParametroDescripcion
from .ParametroCategoria import ParametroCategoria

@dataclass(frozen=True)
class Parametro:
    id: ParametroId
    clave: ParametroClave
    nombre: ParametroNombre
    valor: ParametroValor
    descripcion: ParametroDescripcion
    categoria: ParametroCategoria
