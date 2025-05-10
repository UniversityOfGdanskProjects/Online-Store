import sqlite3

# Połącz się z bazą danych
conn = sqlite3.connect('Hearth_And_Home.db')
cursor = conn.cursor()

# Usuń wszystkie rekordy z tabeli
cursor.execute("DELETE FROM orders")
cursor.execute("DELETE FROM order_items")

# Zatwierdź zmiany
conn.commit()

# Zamknij połączenie
conn.close()