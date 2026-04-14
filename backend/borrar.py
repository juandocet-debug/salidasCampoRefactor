import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'otium.sqlite3')
conn = sqlite3.connect(db_path)
cur = conn.cursor()
try:
    cur.execute('DELETE FROM Core_salidamodelo')
    conn.commit()
    print("Salidas y dependencias eliminadas")
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
