import sqlite3

class Database:
    def __init__(self, db_name = 'Hearth_And_Home.db'):
        self.db_name = db_name
        self.connection = sqlite3.connect(self.db_name, check_same_thread=False)
        self.create_tables()
    
    def create_tables(self):
        cursor = self.connection.cursor()

        cursor.execute('''CREATE TABLE IF NOT EXISTS users(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       first_name TEXT NOT NULL,
                       last_name TEXT NOT NULL,
                       email TEXT UNIQUE NOT NULL,
                       password TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS categories(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT UNIQUE NOT NULL,
                       parent_id INTEGER,
                       FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS products(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT NOT NULL,
                       description TEXT,
                       price REAL NOT NULL,
                       stock INTEGER NOT NULL,
                       category_id INTEGER,
                       image_url TEXT,
                       created_atTIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (category_id) REFERENCES categoriues(id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS orders(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       user_id INTEGER NOT NULL,
                       total_price REAL NOT NULL,
                       status TEXT CHECK(status IN ('pending', 'shipped', 'delivered', 'cancelled')) NOT NULL DEFAULT 'pending',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS order_items(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       order_id INTEGER NOT NULL,
                       product_id INTEGER NOT NULL,
                       quantity INTEGER NOT NULL,
                       price REAL NOT NULL,
                       FOREIGN KEY (order_id) REFERENCES orders(id),
                       FOREIGN KEY (product_id) REFERENCES products(id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS reviews(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       user_id INTEGER NOT NULL,
                       product_id INTEGER NOT NULL,
                       rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
                       comment TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (user_id) REFERENCES users(id),
                       FOREIGN KEY (product_id) REFERENCES products(id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS coupons(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       code TEXT UNIQUE NOT NULL,
                       discount REAL NOT NULL,
                       expires_at TIMESTAMP NOT NULL
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS product_recommendations(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       product_id INTEGER NOT NULL,
                       recommended_product_id INTEGER NOT NULL,
                       FOREIGN KEY (product_id) REFERENCES products(id),
                       FOREIGN KEy (recommended_product_id) REFERENCES products(id)
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS admin(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       email TEXT UNIQUE NOT NULL,
                       password TEXT NOT NULL
                    )''')
        self.connection.commit()

    def add_user(self, first_name: str, last_name: str, email: str, password: str):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO users (first_name, last_name, email, password) VALUES(?, ?, ?, ?)", (first_name, last_name, email, password))
        self.connection.commit()
        print(f'Zarejestrowano uytkownika {first_name} do bazy danych.')
    
    def check_if_user_email_has_an_account(self, email = str) -> bool:
        cursor = self.connection.cursor()
        cursor.execute('SELECT email FROM users WHERE email = ?', (email,))
        result = cursor.fetchall()
        return result[0] if result else None

    def add_admin(self, email: str, password: str):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO admin (email, password) VALUES(?, ?)", (email, password))   
        self.connection.commit()
        print(f'Zarejestrowano admin {email} do bazy danych.') 

    def check_if_admin_email_has_an_account(self, email = str) -> bool:
        cursor = self.connection.cursor()
        cursor.execute('SELECT email FROM admin WHERE email = ?', (email,))
        result = cursor.fetchall()
        return result[0] if result else None
    
    def fetch_user_password(self, email: str):
        cursor = self.connection.cursor()
        cursor.execute("SELECT password FROM users WHERE email=?", (email,))
        result = cursor.fetchall()
        return result[0] if result else None

    def fetch_admin_password(self, email: str):
        cursor = self.connection.cursor()
        cursor.execute("SELECT password FROM admin WHERE email=?", (email,))
        result = cursor.fetchall()
        return result[0] if result else None
    
    def check_if_category_exist(self, category):
        cursor = self.connection.cursor()
        cursor.execute("SELECT name FROM categories WHERE name = ?", (category, ))
        result = cursor.fetchall()
        return result[0] if result else None
    
    def check_if_parent_exist(self, parent_id):
        cursor = self.connection.cursor()
        print(parent_id)
        print(self.get_category_id())
        cursor.execute("SELECT id FROM categories WHERE id = ?", (parent_id, ))
        result = cursor.fetchall()
        print(len(result))
        return len(result) > 0
        
    def add_category(self, name, parent_id = None):
        if parent_id == None:
            cursor = self.connection.cursor()
            cursor.execute("INSERT INTO categories (name) VALUES(?)", (name,))
            self.connection.commit()
            print(parent_id)
            print(f'Dodano Kategorie {name}.')
        else:
            cursor = self.connection.cursor()
            cursor.execute("INSERT INTO categories (name, parent_id) VALUES(?,?)", (name, parent_id))
            self.connection.commit()
            print(f'Dodano Podkategorie {name}, Id Rodzica {parent_id}')
        
    def get_category_id(self,):
        curosr = self.connection.cursor()
        curosr.execute("SELECT * FROM categories")
        result = curosr.fetchall()
        return result

    
if __name__ == "__main__":
    db = Database()
    print("Utworzono bazę danych i tabele.")
