import sqlite3

conn = sqlite3.connect('otium.sqlite3')
c = conn.cursor()

try:
    c.execute('''
    CREATE TABLE IF NOT EXISTS "auth_user" (
        "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
        "password" varchar(128) NOT NULL,
        "last_login" datetime NULL,
        "is_superuser" bool NOT NULL,
        "username" varchar(150) NOT NULL UNIQUE,
        "first_name" varchar(150) NOT NULL,
        "last_name" varchar(150) NOT NULL,
        "email" varchar(254) NOT NULL,
        "is_staff" bool NOT NULL,
        "is_active" bool NOT NULL,
        "date_joined" datetime NOT NULL
    )
    ''')
    
    # Try to insert dummy user ID 1
    c.execute('''
    INSERT OR IGNORE INTO auth_user (id, password, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) 
    VALUES (1, 'pbkdf2_sha...', 1, 'admin', 'Admin', 'User', 'admin@upn.edu.co', 1, 1, '2026-03-25 12:00:00')
    ''')
    conn.commit()
    print("Tabla auth_user creada y poblada.")
except Exception as e:
    print("Error:", e)
finally:
    conn.close()
