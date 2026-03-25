import json
import urllib.request
import urllib.error

url = 'http://localhost:8000/api/auth/login/'
data = json.dumps({"correo": "profesor@upn.edu.co", "contrasena": "otium2026"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
        print("BODY:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("STATUS:", e.code)
    print("BODY:", e.read().decode('utf-8'))
