import sqlite3

conn = sqlite3.connect('otium.sqlite3')
cur = conn.cursor()

# Listar todas las tablas que existen
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tablas = [r[0] for r in cur.fetchall()]
print("TABLAS:", tablas)

# Buscar la tabla de salidas
salida_table = None
for t in tablas:
    if 'salida' in t.lower():
        salida_table = t
        print(f"  Encontrada tabla: {t}")

if salida_table:
    cur.execute(f"SELECT id, codigo, nombre, estado FROM {salida_table}")
    rows = cur.fetchall()
    print(f"\nSalidas en {salida_table}:")
    for r in rows:
        print(f"  {r}")

conn.close()
