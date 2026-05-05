import sqlite3
db = sqlite3.connect('otium.sqlite3')
print("Salidas en DB:")
for row in db.execute("SELECT id, codigo, estado, nombre FROM salidas_core_salida").fetchall():
    print(row)
