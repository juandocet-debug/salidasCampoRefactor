import sqlite3
conn = sqlite3.connect('otium.sqlite3')
cur = conn.cursor()
cur.execute("SELECT id, itinerario_id, orden, nombre, tipo FROM salidas_itinerario_parada ORDER BY itinerario_id, orden")
rows = cur.fetchall()
print("=== PARADAS EN DB ===")
for r in rows:
    print(r)
cur.execute("SELECT id, salida_id, distancia_km FROM salidas_itinerario_itinerario")
its = cur.fetchall()
print("\n=== ITINERARIOS EN DB ===")
for i in its:
    print(i)
cur.execute("SELECT id, nombre, punto_partida, parada_max FROM salidas_core_salida")
sals = cur.fetchall()
print("\n=== SALIDAS (punto_partida / parada_max) ===")
for s in sals:
    print(s)
conn.close()
