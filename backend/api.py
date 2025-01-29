import bcrypt
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.database import Database


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000/*"}})
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

if __name__ == '__main__':
    app.run()