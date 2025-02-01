import sqlite3

# Połącz się z bazą danych
conn = sqlite3.connect('Hearth_And_Home.db')
cursor = conn.cursor()

# Usuń wszystkie rekordy z tabeli
cursor.execute("DELETE FROM categories WHERE name='Dywany naturalne'")

# Zatwierdź zmiany
conn.commit()

# Zamknij połączenie
conn.close()