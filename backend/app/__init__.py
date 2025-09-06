from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .routes import register_routes
from .db import db
migrate = Migrate()

def create_app(config_class='config.Config'):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)
    JWTManager(app)
    migrate.init_app(app, db)
    
    register_routes(app)
    with app.app_context():
        db.create_all()
    return app
