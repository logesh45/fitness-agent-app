from flask import Flask
from flask_cors import CORS
from .models.user_profile import db
from .routes.api import api

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure SQLAlchemy - use app.root_path to ensure correct path
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{app.root_path}/instance/fitness.db"
    # No need to use environment variable 

    print(f"SQLALCHEMY_DATABASE_URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app
