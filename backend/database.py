import sqlite3

class Database:
    def __init__(self, db_name = 'HoomStore.db'):
        self.db_name = db_name
        self.connection = sqlite3.connect(self.db_name, check_same_thread=False)
        self.create_tables()
        self.size_table = ['S','M','L','XL','XXL','36','37','38','39','40','41','42','43','44','45','46','47','48']
        for size in self.size_table:
            self.add_size(size)

    def create_tables(self):
        cursor = self.connection.cursor()

        cursor.execute('''CREATE TABLE IF NOT EXISTS User(
                        email TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        surename TEXT NOT NULL,
                        password TEXT NOT NULL,
                        admin BOOLEAN NOT NULL
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Size(
                       size_id TEXT PRIMARY KEY,
                       size TEXT NOT NULL
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Size_List(
                       list_id TEXT PRIMARY KEY,
                       size_id TEXT NOT NULL,
                       FOREIGN KEY(size_id) REFERENCES Size(size_id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Product(
                       product_id TEXT PRIMARY KEY,
                       name TEXT NOT NULL,
                       gender TEXT NOT NULL,
                       type TEXT NOT NULL,
                       list_size_id TEXT NOT NULL,
                       price TEXT NOT NULL,
                       category TEXT NOT NULL,
                       color TEXT NOT NULL,
                       FOREIGN KEY(list_size_id) REFERENCES Size_List(list_id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Order(
                       order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                       order_date TEXT NOT NULL,
                       user_id TEXT NOT NULL,
                       FOREIGN KEY(user_id) REFERENCES User(email)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Basket(
                       basket_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                       order_id TEXT NOT NULL,
                       product_id TEXT NOT NULL,
                       FOREIGN KEY(order_id) REFERENCES Order(order_id)
                       FOREIGN KEY(product_id) REFERENCES Product(product_id)
                    )''')
        
        self.connection.commit()

    def add_user(self, email = str, name = str, surename = str, password = str, admin = bool):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO User (email, name, surename, password, admin ) VALUES(?, ?, ?, ?, ?)", (email, name, surename, password, admin))
        self.connection.commit()
        if admin:
            print(f'Zarejestrowano admina {name} do bazy danych.')
        else:
            print(f'Zarejestrowano uytkownika {name} do bazy danych.')

    def add_size(self, size = str):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO Size size VALUES(?)", size)
        self.connection.commit()
        print(f"Dodano rozmiar: {size}")
    


if __name__ == "__main__":
    db = Database()
    print("Utworzono bazę danych i tabele.")
