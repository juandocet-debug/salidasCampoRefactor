import json, urllib.request, urllib.error, re
url = 'http://localhost:8000/api/facultades/'
data = json.dumps({"nombre": "Ciencias3", "activa": True}).encode('utf-8')
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc0NDg2Nzc0LCJpYXQiOjE3NzQ0NTc5NzQsImp0aSI6IjdjODUxNzQ2MDgyYjRlMmQ4YjJhYWRjOTNiYzRlMjYwIiwidXNlcl9pZCI6MX0.2JGmpataKrd4c5Tc5r2gpJEKi_17Mbea6hz81nSLe6g"

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
try:
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
except urllib.error.HTTPError as e:
    html = e.read().decode('utf-8', errors='ignore')
    match = re.search(r'<title>(.*?)<\/title>', html)
    print("STATUS:", e.code)
    print("ERROR TITLE:", match.group(1) if match else "No title")
    match2 = re.search(r'<th>Exception Value:</th>\s*<td><pre>(.*?)</pre>', html, re.DOTALL)
    print("EXCEPTION:", match2.group(1).strip() if match2 else "Unknown")
