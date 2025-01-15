from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.database import Database

app = Flask(__name__)
CORS(app, resources={r"/api/*": {'origins': 'http://localhost:3000/*'}})

db = Database()
@app.route('/api/user/{user_email}/add_transaction', methods = ['PUT'])
def add_transaction():
    data = request.get_json()

    db.add_transaction(data.get('amount'), data.get('category'), data.get('description'), data.get('date'), data.get('user_id'))
    return jsonify({'message': 'Transaction Added.'}), 201