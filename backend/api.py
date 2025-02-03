import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.database import Database
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
db = Database()

@app.route('/api/user/register', methods = ['PUT'])
def register_user():
    data = request.get_json()

    if find_user_email(data.get('email')):
        return jsonify({'error': 'There is already an account with the same email.'}), 409
    
    hash_password = password_hashing(data.get('password'))

    db.add_user(data.get('first_name'), data.get('last_name'), data.get('email'), hash_password)
    return jsonify({'message': 'Account Created'}), 201

@app.route('/api/user/login', methods = ['POST'])
def login_user_to_account():
    data = request.get_json()

    if find_user_email(data.get('email')) == False:
        return jsonify({'error': 'Account with this email dose not exist.'}), 409
    
    result = db.fetch_user_password(data.get('email'))

    if result:
        hashed_password = result[0]

        if bcrypt.checkpw(data.get('password').encode('utf-8'), hashed_password.encode('utf-8')):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
    
def find_user_email(email):
    account = db.check_if_user_email_has_an_account(email)
    if account:
        return True
    else:
        return False
    
@app.route('/api/admin/register', methods = ['PUT'])
def register_admin():
    data = request.get_json()

    if find_admin_email(data.get('email')):
        return jsonify({'error': 'There is already an account with the same email.'}), 409
    
    hashed_password = password_hashing(data.get('password'))
    db.add_admin(data.get('email'), hashed_password)
    return jsonify({'message': 'Admin Account Created'}), 201

@app.route('/api/admin/login', methods = ['POST'])
def login_admin_to_account():
    data = request.get_json()

    if find_admin_email(data.get('email')) == False:
        return jsonify({'error': 'Account with this email dose not exist.'}), 409
    
    result = db.fetch_admin_password(data.get('email'))

    if result:
        hashed_password = result[0]

        if bcrypt.checkpw(data.get('password').encode('utf-8'), hashed_password.encode('utf-8')):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

def find_admin_email(email):
    account = db.check_if_admin_email_has_an_account(email)
    if account:
        return True
    else:
        return False

def password_hashing(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

@app.route('/api/admin/category', methods = ['POST'])
def add_category():
    data = request.get_json()
    if data.get('parent_id') != None:
        parent = int(data.get('parent_id'))
        print(parent)
    else:
        parent = data.get('parent_id')

    if db.check_if_category_exist(data.get('name')) is not None:
        return jsonify({'error': 'Category Already Exists'}), 400
    
    if parent == None:
        db.add_category(data.get('name'))
        return jsonify({'message': 'Category Added Sucessfuly'}), 200
    else:
        if not db.check_if_parent_exist(parent):
            return jsonify({'error': "Category Dosen't Exists"}), 400
        db.add_category(data.get('name'), parent)
        return jsonify({'message': 'Category Added Sucessfuly'}), 200
    
@app.route('/api/admin/get/category', methods = ['GET'])
def get_category():
    result = db.get_all_category()
    categories = [{"id": cat[0], "name": cat[1], "parent_id": cat[2]} for cat in result]
    return jsonify(categories), 200

@app.route('/api/admin/category/<category_id>', methods = ['DELETE'])
def delete_category(category_id):
    category = db.get_category_by_id(category_id)

    if not category:
        return jsonify({'error': 'Category not found.'}), 404
    
    db.delete_category(category_id)
    return jsonify({'message': 'Category deleted successfully.'}), 200

@app.route('/api/admin/category/<category_id>', methods = ['PUT'])
def update_category(category_id):
    data = request.get_json()

    if data.get('parent_id') != None:
        parent = int(data.get('parent_id'))
        print(parent)
    else:
        parent = data.get('parent_id')

    db.update_category(category_id, data.get('name'), parent)

    return jsonify({'message': 'Category updated'}), 200

@app.route('/api/admin/category/<category_id>', methods = ['GET'])
def get_category_by_id(category_id):
    category = db.get_category_by_id(category_id)

    if category:
        return jsonify(category), 200
    else:
        return jsonify({'error': 'Category not found'}), 404

@app.route('/api/admin/product', methods = ['POST'])
def add_product():
    data = request.get_json()
    if data.get('category_id') != None:
        category = int(data.get('category_id'))
        print(category)
    else:
        category = data.get('category_id')

    if not db.check_if_parent_exist(category):
        return jsonify({'error': "Category Dosen't Exists"}), 400
    db.add_product(data.get('name'), data.get('description'), data.get('price'), data.get("stock"), category, data.get('image_url'), data.get('created_at'))
    return jsonify({'message': 'Product Added Sucessfuly'}), 200

@app.route('/api/admin/get/product', methods = ['GET'])
def get_all_products():
    result = db.get_all_products()
    products = [{"id": cat[0], "name": cat[1], "description": cat[2], "price": cat[3], "stock": cat[4], "category_id": cat[5], "image_url": cat[6], "created_at": cat[7]} for cat in result]
    return jsonify(products), 200

@app.route('/api/admin/product/<product_id>', methods = ['DELETE'])
def delete_product(product_id):
    product = db.get_product_by_id(product_id)

    if not product:
        return jsonify({'error': 'Product not found.'}), 404
    
    db.delete_product(product_id)
    return jsonify({'message': 'Product deleted successfully.'}), 200

@app.route('/api/admin/product/<product_id>', methods = ['PUT'])
def update_product(product_id):
    data = request.get_json()

    category = int(data.get('category_id'))
    print(category)

    db.update_product(product_id, data.get('name'), data.get('description'), data.get('price'), data.get("stock"), category, data.get('image_url'), data.get('created_at'))

    return jsonify({'message': 'Product updated'}), 200

@app.route('/api/admin/product/<product_id>', methods = ['GET'])
def get_product_by_id(product_id):
    product = db.get_product_by_id(product_id)

    if product:
        return jsonify(product), 200
    else:
        return jsonify({'error': 'Product not found'}), 404
    
@app.route('/api/user/product/add/review/<product_id>', methods = ['POST'])
def add_review(product_id):
    data = request.get_json()
    user_email = data.get('user_email')

    if not find_user_email(user_email):
        return jsonify({'error': f"Account with {user_email} doesn't exist."}), 409

    
    user_id = db.get_user_id(user_email)
    if user_id is None:
        return jsonify({'error': 'User not found.'}), 404

    current_date = datetime.now().strftime("%Y-%m-%d")

    db.add_opinion(user_id, product_id, int(data.get('rating')), data.get('comment'), current_date)
    return jsonify({'message': 'Opinion Added.'}), 200

@app.route('/api/user/product/get/rating/<product_id>', methods = ['GET'])
def get_rating_for_product(product_id):
    result = db.get_rating_by_product(product_id)

    if result is None:
        return jsonify({'message': 'No ratings for this product'}), 404
    
    return jsonify(result), 200

@app.route('/api/user/product/get/opinions/<product_id>', methods=['GET'])
def get_all_opinions_for_product(product_id):
    data = db.get_all_opinions_by_product(product_id)
    if not data:
        return jsonify({'message': 'No opinions for this product'}), 404

    result = []
    for line in data:
        user_name = db.get_user_name(line[0])
        result.append({
            'user_name': user_name,
            'comment': line[2],
            'rating': line[1]
        })
    
    return jsonify(result), 200

    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)