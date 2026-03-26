# PROMPT DE CONTEXTO: Integración de IA de Rutas — Arquitectura Hexagonal

## CONTEXTO DEL PROYECTO

Proyecto Django + React llamado **"Salidas de Campo"** (gestión de salidas académicas universitarias).
El backend usa **arquitectura hexagonal estricta**. El frontend usa React + Vite con hooks custom.

**Rutas principales:**
- Backend: `salidasCampo-main/backend/`
- Frontend: `salidasCampo-main/frontend/src/`

---

## EL PROBLEMA A RESOLVER

El módulo de **Logística → Itinerario** tiene un endpoint de IA que calcula el tiempo de viaje
en bus entre dos puntos de Colombia usando Groq (Llama). Este endpoint devuelve `minutos: 0`
o falla silenciosamente. El frontend muestra `0 min` aunque todo parece conectado.

---

## ARQUITECTURA HEXAGONAL: CÓMO ESTÁ ESTRUCTURADO EL MÓDULO

Cada módulo de negocio sigue EXACTAMENTE esta estructura de carpetas:

```
modulos/
└── Salidas/
    └── Itinerario/
        ├── dominio/                    ← SOLO interfaces y value objects. SIN Django.
        │   ├── GeneradorRutaIAPort.py  ← Puerto de salida (interfaz abstracta de la IA)
        │   ├── ItinerarioRepository.py ← Puerto de salida (interfaz abstracta del repo)
        │   └── [ValueObjects].py
        │
        ├── aplicacion/                 ← Casos de uso. Orquestan dominio + puertos.
        │   ├── EstimarTiempoRuta/
        │   │   └── EstimarTiempoRuta.py   ← Llama a ia_port.estimar_tiempo_ruta()
        │   ├── GenerarMunicipiosRuta/
        │   │   └── GenerarMunicipiosRuta.py
        │   └── ConsultarAsistenciaRuta/
        │       └── ConsultarAsistenciaRuta.py
        │
        └── infraestructura/            ← Implementaciones concretas. Aquí sí hay Django.
            ├── DjangoRutaIAAdapter.py  ← ADAPTADOR: implementa GeneradorRutaIAPort
            ├── DjangoItinerarioRepository.py
            ├── ItinerarioController.py ← Controladores REST (APIView de DRF)
            ├── models.py
            └── urls.py
```

### Regla de oro hexagonal:
- El **dominio** no sabe nada de Django ni de Groq
- La **aplicación** solo habla con puertos (interfaces)
- La **infraestructura** implementa los puertos e inyecta las dependencias

---

## ARCHIVOS CLAVE Y SU CONTENIDO ESPERADO

### 1. Puerto de dominio: `dominio/GeneradorRutaIAPort.py`
```python
from abc import ABC, abstractmethod

class GeneradorRutaIAPort(ABC):
    @abstractmethod
    def consultar_asistencia_ruta(self, contexto_ruta: str) -> str: ...
    @abstractmethod
    def extraer_municipios_ruta(self, inicio: str, fin: str, instrucciones: str) -> list: ...
    @abstractmethod
    def estimar_tiempo_ruta(self, origen: str, destino: str) -> int: ...
```

### 2. Caso de uso: `aplicacion/EstimarTiempoRuta/EstimarTiempoRuta.py`
```python
from modulos.Salidas.Itinerario.dominio.GeneradorRutaIAPort import GeneradorRutaIAPort

class EstimarTiempoRuta:
    def __init__(self, ia_port: GeneradorRutaIAPort):
        self.ia_port = ia_port

    def run(self, origen: str, destino: str) -> int:
        if not origen or not destino:
            raise ValueError("Origen y destino son requeridos")
        return self.ia_port.estimar_tiempo_ruta(origen, destino)
```

### 3. Adaptador de IA: `infraestructura/DjangoRutaIAAdapter.py`

**ERRORES COMUNES Y CÓMO EVITARLOS:**

❌ **Error 1 — Charset Windows:** Usar caracteres Unicode (→ á é ó) en strings que se
   convierten con `.encode('utf-8')` dentro de `json.dumps()` en Windows puede lanzar
   `'charmap' codec can't encode character`. SIEMPRE usar solo ASCII en los prompts.

❌ **Error 2 — Sin User-Agent:** Groq retorna `HTTP 403 Forbidden` si el request no incluye
   el header `'User-Agent': 'Mozilla/5.0'`. Es obligatorio.

❌ **Error 3 — Modelo equivocado para velocidad:** `llama-3.3-70b-versatile` es 3-4x más lento
   que `llama-3.1-8b-instant`. Para preguntas simples (un número), usar el modelo 8b.

❌ **Error 4 — `response_format` sin el modelo correcto:** `response_format: json_object`
   solo funciona bien con `llama-3.1-8b-instant`. Con `llama-3.3-70b-versatile` puede
   ser ignorado y devolver texto libre que falla el parser.

❌ **Error 5 — IA devuelve horas en vez de minutos totales:** Si el prompt pide minutos
   totales pero la IA devuelve `{"horas": 9, "minutos": 30}` (minutos = fracción),
   hay que normalizar: `if minutos < 60 and horas >= 1: minutos = horas*60 + minutos`

**Implementación correcta del adaptador:**
```python
import json, re, urllib.request
from typing import Optional
from modulos.Salidas.Itinerario.dominio.GeneradorRutaIAPort import GeneradorRutaIAPort

try:
    from decouple import config
except ImportError:
    import os
    config = lambda key, default='': os.environ.get(key, default)

_GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

def _groq_headers(key: str) -> dict:
    return {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',          # OBLIGATORIO — sin esto Groq da 403
    }

def _extraer_objeto_json(texto: str) -> dict:
    match = re.search(r'\{[\s\S]*\}', texto)
    if match:
        try:
            r = json.loads(match.group())
            if isinstance(r, dict): return r
        except: pass
    return {}

class DjangoRutaIAAdapter(GeneradorRutaIAPort):

    def estimar_tiempo_ruta(self, origen: str, destino: str) -> int:
        # 8b-instant + response_format = velocidad maxima (1-2s vs 6-8s del 70b)
        # SOLO ASCII en el prompt — no usar tildes ni Unicode en Windows
        prompt = (
            f'Tiempo de viaje en bus desde "{origen}" hasta "{destino}" en Colombia. '
            'Considera trafico y cordilleras. '
            'Responde SOLO JSON: {"minutos": NUMERO_TOTAL_ENTERO}'
        )
        groq_key = config('GROQ_API_KEY', default='')
        if not groq_key:
            return 0
        try:
            payload = json.dumps({
                'model': 'llama-3.1-8b-instant',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.0,
                'max_tokens': 50,
                'response_format': {'type': 'json_object'},
            }).encode('utf-8')
            req = urllib.request.Request(
                _GROQ_URL, data=payload,
                headers=_groq_headers(groq_key), method='POST'
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                if resp.status == 200:
                    texto = json.loads(resp.read().decode('utf-8'))['choices'][0]['message']['content']
                    obj = _extraer_objeto_json(texto)
                    minutos = obj.get('minutos', 0) or int(obj.get('horas', 0) * 60)
                    return int(minutos)
        except Exception as e:
            print('[IA] Error Tiempo:', e)
        return 0
```

### 4. Controlador: `infraestructura/ItinerarioController.py`
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .DjangoRutaIAAdapter import DjangoRutaIAAdapter
from modulos.Salidas.Itinerario.aplicacion.EstimarTiempoRuta.EstimarTiempoRuta import EstimarTiempoRuta

class EstimarTiempoRutaController(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        origen  = request.data.get('origen', '')
        destino = request.data.get('destino', '')
        ia_port = DjangoRutaIAAdapter()
        try:
            minutos = EstimarTiempoRuta(ia_port=ia_port).run(origen, destino)
            return Response({'ok': True, 'datos': {'minutos': minutos}})
        except Exception as e:
            return Response({'ok': False, 'error': str(e)}, status=400)
```

### 5. URLs: `infraestructura/urls.py`
```python
from django.urls import path
from .ItinerarioController import (
    ItinerarioController, EstimarTiempoRutaController,
    BuscarMunicipiosRutaController, ItinerarioIAController
)

urlpatterns = [
    path('',                    ItinerarioController.as_view()),
    path('<int:pk>/',           ItinerarioController.as_view()),
    path('ia/analisis/',        ItinerarioIAController.as_view()),
    path('ia/municipios/',      BuscarMunicipiosRutaController.as_view()),
    path('ia/tiempo-ruta/',     EstimarTiempoRutaController.as_view()),
]
```

### 6. config/urls.py (registro global)
```python
path('api/salidas/itinerario/', include('modulos.Salidas.Itinerario.infraestructura.urls')),
```

---

## FRONTEND: CÓMO SE CONSUME EL ENDPOINT

### Hook: `useRutaIA.js`
```javascript
import { clienteHttp } from '@/shared/api/clienteHttp';  // OBLIGATORIO — tiene token JWT

const API_TIEMPO = '/api/salidas/itinerario/ia/tiempo-ruta/';

export function useRutaIA(puntos, distanciaKm, setRutaInfo, tag) {
    useEffect(() => {
        const ori = puntos[0];
        const dst = puntos[puntos.length - 1];
        if (!ori?.nombre || !dst?.nombre || distanciaKm <= 0) return;

        clienteHttp.post(API_TIEMPO, { origen: ori.nombre, destino: dst.nombre })
            .then(res => {
                const data = res.data;
                if (data.ok) {                           // NO: if (data.ok && data.datos?.minutos)
                    const mins = data.datos?.minutos ?? 0; // 0 es válido, no es error
                    setRutaInfo(prev => ({
                        ...prev,
                        duracion_min:     mins,
                        _pendienteGemini: false,
                        _gemini:          true,
                    }));
                }
            });
    }, [puntos, distanciaKm]);
}
```

**Errores comunes en el frontend:**
- ❌ Usar `fetch()` nativo → da 401 Unauthorized (falta token JWT)
- ❌ `if (data.ok && data.datos?.minutos)` → falla cuando `minutos === 0` (0 es falsy en JS)
- ✅ SIEMPRE usar `clienteHttp` del shared para requests autenticados

---

## CHECKLIST DE DIAGNÓSTICO (en orden)

1. **¿El servidor arranca sin errores?**
   - Revisar logs de `py manage.py runserver`
   - Buscar `SyntaxError` o `IndentationError` en el adaptador

2. **¿El endpoint devuelve 404?**
   - Verificar que `urls.py` del módulo tiene `path('ia/tiempo-ruta/', ...)`
   - Verificar que `config/urls.py` incluye `include('modulos.Salidas.Itinerario.infraestructura.urls')`

3. **¿El endpoint devuelve 401?**
   - El frontend usa `fetch()` nativo en vez de `clienteHttp`
   - Cambiar a `clienteHttp.post(...)` que incluye el token JWT

4. **¿El endpoint devuelve 200 pero `minutos: 0`?**
   Revisar los logs del servidor Django. El error más probable aparece ahí:
   - `charmap codec can't encode character` → Hay Unicode (tildes, →) en el prompt. Reemplazar con ASCII.
   - `HTTP Error 403` → Falta el header `User-Agent: Mozilla/5.0` en el request a Groq
   - `JSON decode error` → La IA respondió texto libre. Usar `response_format: json_object`
   - `timeout` → Modelo muy grande. Cambiar `llama-3.3-70b-versatile` por `llama-3.1-8b-instant`

5. **¿El frontend muestra 0 aunque el backend devuelve minutos correctos?**
   - La condición `if (data.ok && data.datos?.minutos)` falla con 0 (falsy)
   - Cambiar a `if (data.ok)` y luego `const mins = data.datos?.minutos ?? 0`

6. **¿La app crashea en el tablero con `salidas.filter is not a function`?**
   - El backend devolvió un objeto en lugar de array (error del servidor)
   - En `useSalidas.js`: `setSalidas(Array.isArray(data) ? data : (data?.results ?? []))`

---

## VARIABLES DE ENTORNO NECESARIAS

```env
# backend/.env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx   # Clave de Groq — OBLIGATORIA
GEMINI_API_KEY=                          # Opcional (fallback, puede estar vacía)
```

**Verificar que la key no esté expirada:**
```python
import json, urllib.request
key = 'gsk_tu_clave'
headers = {'Authorization': f'Bearer {key}', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
payload = json.dumps({'model': 'llama-3.1-8b-instant', 'messages': [{'role': 'user', 'content': 'test'}], 'max_tokens': 5}).encode()
req = urllib.request.Request('https://api.groq.com/openai/v1/chat/completions', data=payload, headers=headers, method='POST')
with urllib.request.urlopen(req, timeout=10) as r:
    print('OK:', r.status)  # Debe ser 200, no 403
```

---

## NOTA SOBRE EL PROYECTO ANTIGUO (salidasSof)

El proyecto anterior `C:\Users\SOPORTE\Documents\upn\Proyectos\salidasSof\backend-backup`
tiene la implementación funcional en:
- `api/profesor/salidas/vistas_ia.py` → función `tiempo_ruta()` y `llamar_groq()`
- `api/nucleo/utils.py` → helpers de Groq compartidos

La lógica clave del proyecto antiguo que funciona:
1. `User-Agent: 'Mozilla/5.0'` en headers
2. Prompt en ASCII puro (sin tildes)
3. Extracción de JSON con `re.search(r'\{[\s\S]*\}', texto)` (tolerante a texto libre)
4. Normalización: `if minutos < 60 and horas >= 1: minutos = horas*60 + minutos`
