from flask import Flask
from flask_cors import CORS
from .models.user_profile import db
from .routes.api import api
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///fitness.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app
