import sqlite3
conn = sqlite3.connect('otium.sqlite3')
cur = conn.cursor()
cur.execute("DELETE FROM salidas_itinerario_parada WHERE itinerario_id=14 AND tipo='retorno' AND id NOT IN (SELECT id FROM salidas_itinerario_parada WHERE itinerario_id=14 AND tipo='retorno' ORDER BY id LIMIT 2)")
conn.commit()
print("Cleanup done")
conn.close()
