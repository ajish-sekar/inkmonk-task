
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

from config import app_config


db = SQLAlchemy()
ma = Marshmallow()

def create_app(config_name):
	app = Flask(__name__, instance_relative_config = True, static_folder = "../../static/dist", template_folder="../../static")
	app.config.from_object(app_config[config_name])
	app.config.from_pyfile('config.py')
	db.init_app(app)
	ma.init_app(app)
	
	migrate = Migrate(app, db)

	from app import models

	from .inventory import inventory as inventory_blueprint
	app.register_blueprint(inventory_blueprint)

	from .auth import auth as auth_blueprint
	app.register_blueprint(auth_blueprint)

	@app.route('/', defaults={'path': ''})
	@app.route('/<path:path>')
	def catch_all(path):
		return render_template("index.html")


	return app
