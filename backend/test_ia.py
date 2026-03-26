import urllib.request, json, urllib.error

BASE = 'http://127.0.0.1:8000'

# 1. Login
login_data = json.dumps({'username': 'admin', 'password': 'admin123'}).encode()
req = urllib.request.Request(f'{BASE}/api/usuarios/login/', data=login_data, headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, timeout=5) as r:
        tok = json.loads(r.read()).get('access', '')
        print('Token OK:', tok[:30] + '...')
except Exception as e:
    print('Login ERROR:', e)
    # Intentar con /api/auth/login/
    req2 = urllib.request.Request(f'{BASE}/api/auth/login/', data=login_data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req2, timeout=5) as r2:
            tok = json.loads(r2.read()).get('access', '')
            print('Token (auth) OK:', tok[:30] + '...')
    except Exception as e2:
        print('Auth Login ERROR:', e2)
        tok = ''

if not tok:
    print('Sin token - saliendo')
    exit(1)

# 2. Llamar endpoint
payload = json.dumps({'origen': 'Bogota', 'destino': 'Medellin'}).encode()
req3 = urllib.request.Request(
    f'{BASE}/api/salidas/itinerario/ia/tiempo-ruta/',
    data=payload,
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {tok}'},
    method='POST'
)
try:
    with urllib.request.urlopen(req3, timeout=25) as r3:
        resp = json.loads(r3.read())
        print('ENDPOINT RESPONDE:', resp)
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, e.read()[:500])
except Exception as e:
    print('ERROR endpoint:', e)
