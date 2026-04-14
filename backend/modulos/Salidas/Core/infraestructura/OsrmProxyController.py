"""
OsrmProxyController — Proxy para enrutar las peticiones de OSRM desde el backend.
El servidor hace la petición a OSRM (sin restricciones CORS) y devuelve la respuesta.
"""
import urllib.request
import urllib.error
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class OsrmProxyController(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        coords = request.GET.get('coords', '')
        if not coords:
            return Response({'error': 'coords requerido'}, status=status.HTTP_400_BAD_REQUEST)

        overview = request.GET.get('overview', 'full')
        geometries = request.GET.get('geometries', 'geojson')

        url = (
            f'https://router.project-osrm.org/route/v1/driving/{coords}'
            f'?overview={overview}&geometries={geometries}'
        )
        try:
            req = urllib.request.Request(
                url,
                headers={
                    'User-Agent': 'OtiumApp/1.0',
                    'Accept': 'application/json',
                }
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read())
            return Response(data, status=status.HTTP_200_OK)
        except urllib.error.HTTPError as e:
            return Response({'error': f'OSRM HTTP error: {e.code}'}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
