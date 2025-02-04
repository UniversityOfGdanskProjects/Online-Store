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
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    
    def get_user_id(self, email):
        cursor = self.connection.cursor()
        cursor.execute('SELECT id FROM users WHERE email = ?', (email, ))
        result = cursor.fetchone()
        return result[0] if result else None
    
    def get_user_name(self, user_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT first_name FROM users WHERE id = ?', (user_id, ))
        result = cursor.fetchone()
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
        cursor.execute("SELECT id FROM categories WHERE id = ?", (parent_id, ))
        result = cursor.fetchall()
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
        
    def get_all_category(self,):
        curosr = self.connection.cursor()
        curosr.execute("SELECT * FROM categories")
        result = curosr.fetchall()
        return result
    
    def get_category_by_id(self, category_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT * FROM categories WHERE id = ?', (category_id, ))
        result = cursor.fetchall()
        if not result:
            return None 
        
        category = {
            'id': result[0][0], 
            'name': result[0][1],
            'parent_id': result[0][2],
        }
        
        return category
    
    def delete_category(self, category_id):
        cursor = self.connection.cursor()
        cursor.execute('DELETE FROM categories WHERE id = ?', (category_id, ))
        self.connection.commit()

    def update_category(self, category_id, name, parent_id):
        cursor = self.connection.cursor()
        cursor.execute("UPDATE categories SET name = ?, parent_id = ? WHERE id = ?", (name, parent_id, category_id))
        self.connection.commit()
        print(f'Zmodyfikowano transakcje {category_id}.')

    def add_product(self, name, description, price, stock, category_id, image_url, created_at):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO products (name, description, price, stock, category_id, image_url, created_at) VALUES(?, ?, ?, ?, ?, ?, ?)", (name, description, price, stock, category_id, image_url, created_at))
        self.connection.commit()
        print(f'Product Added.')

    def get_all_products(self):
        curosr = self.connection.cursor()
        curosr.execute("SELECT * FROM products")
        result = curosr.fetchall()
        return result
    
    def get_product_by_id(self, product_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id, ))
        result = cursor.fetchall()
        if not result:
            return None 
        
        product = {
            'id': result[0][0], 
            'name': result[0][1],
            'description': result[0][2],
            'price': result[0][3],
            'stock': result[0][4],
            'category_id': result[0][5],
            'image_url': result[0][6],
            'created_at': result[0][7]
        }
        
        return product
    
    def delete_product(self, profuct_id):
        cursor = self.connection.cursor()
        cursor.execute('DELETE FROM products WHERE id = ?', (profuct_id, ))
        self.connection.commit()

    def update_product(self, product_id, name, description, price, stock, category_id, image_url, created_at):
        cursor = self.connection.cursor()
        cursor.execute("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?, created_at = ? WHERE id = ?", (name, description, price, stock, category_id, image_url, created_at, product_id))
        self.connection.commit()
        print(f'Modify product {product_id}.')

    def add_opinion(self, user_id, product_id, rating, comment, created_at):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES(?, ?, ?, ?, ?)", (user_id, product_id, rating, comment, created_at))
        self.connection.commit()
        print(f'Review Added.')

    def get_rating_by_product(self, product_id): 
        cursor = self.connection.cursor()
        cursor.execute("SELECT rating FROM reviews WHERE product_id = ?", (product_id, ))
        result = cursor.fetchall()

        if not result:
            return None
        
        total = sum(rating[0] for rating in result)
        return total/len(result)

    def get_all_opinions_by_product(self, product_id):
        cursor = self.connection.cursor()
        cursor.execute("SELECT user_id, rating, comment FROM reviews WHERE product_id = ?", (product_id, ))
        result = cursor.fetchall()
        return result if result else []
    
    def create_order(self, user_id, total_price):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO orders (user_id, total_price) VALUES (?, ?)", (user_id, total_price))
        self.connection.commit()
        return cursor.lastrowid  # Pobiera ID nowo utworzonego zamówienia

    def get_last_inserted_id(self):
        return self.cursor.lastrowid

    def place_order(self, user_id, cart_items, total_price):
        cursor = self.connection.cursor()
        
        # Dodanie zamówienia
        cursor.execute("INSERT INTO orders (user_id, total_price) VALUES (?, ?)", (user_id, total_price))
        order_id = cursor.lastrowid  # Pobranie ID nowego zamówienia
        
        # Dodanie produktów do order_items
        for item in cart_items:
            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                (order_id, item['id'], item['quantity'], item['price'])
            )
        
        self.connection.commit()
        print(f'Złożono zamówienie #{order_id} dla użytkownika {user_id}.')
        return order_id

    def get_all_orders(self):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM orders")
        orders = cursor.fetchall()
        return orders

    def update_order_status(self, order_id, status):
        cursor = self.connection.cursor()
        cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
        self.connection.commit()
        print(f'Zaktualizowano status zamówienia #{order_id} na {status}.')

    def add_order_item(self, order_id, product_id, quantity, price):
        query = """INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"""
        cursor = self.connection.cursor()  # Pobierz kursor
        cursor.execute(query, (order_id, product_id, quantity, price))  # Wykonaj zapytanie
        self.connection.commit()  # Zatwierdź zmiany
        print(f'Product with ID {product_id} added to order #{order_id}.')

    def update_product_stock(self, product_id, new_stock):
        query = """UPDATE products SET stock = ? WHERE id = ?"""
        cursor = self.connection.cursor()  # Pobierz kursor
        cursor.execute(query, (new_stock, product_id))  # Wykonaj zapytanie
        self.connection.commit()  # Zatwierdź zmiany
        print(f'Product with ID {product_id} stock updated to {new_stock}.')
           
if __name__ == "__main__":
    db = Database()
    print("Utworzono bazę danych i tabele.")
