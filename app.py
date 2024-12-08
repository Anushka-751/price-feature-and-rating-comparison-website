from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and login manager
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# Favorite Products Model
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_name = db.Column(db.String(150), nullable=False)
    platform = db.Column(db.String(50))  # Amazon or Flipkart

# Load User
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password, method='sha256')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/favorite', methods=['POST'])
@login_required
def add_favorite():
    data = request.json
    product_name = data.get('product_name')
    platform = data.get('platform')

    new_favorite = Favorite(user_id=current_user.id, product_name=product_name, platform=platform)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({'message': 'Product added to favorites'}), 201

@app.route('/favorite', methods=['GET'])
@login_required
def get_favorites():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    favorite_list = [{'product_name': f.product_name, 'platform': f.platform} for f in favorites]

    return jsonify({'favorites': favorite_list}), 200

@app.route('/compare', methods=['GET'])
def compare_prices():
    product_name = request.args.get('product_name')
    if not product_name:
        return jsonify({'message': 'Product name is required'}), 400

    # Placeholder for real API integration
    comparison_data = {
        'flipkart': {
            'price': '₹1,89,900',
            'rating': '4.6',
            'features': ['SSD:1 TB', 'RAM:16GB'],
        },
        'amazon': {
            'price': '₹1,69,900',
            'rating': '4.5',
            'features': ['Liquid Retina Display', 'SSD:512GB'],
        }
    }

    return jsonify({'product_name': product_name, 'comparison': comparison_data}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database and tables
    app.run(debug=True)
