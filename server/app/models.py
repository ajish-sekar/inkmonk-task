from werkzeug.security import generate_password_hash, check_password_hash
import json
from app import db
from app import ma

class User(db.Model):

	__tablename__ = 'users'

	id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String(60), unique = True, nullable = False)
	password_hash = db.Column(db.String(128), nullable = False)
	user_token = db.Column(db.String(128), nullable = True)

class UserSchema(ma.Schema):
	class Meta:
		fields = ('username', 'user_token')

class Item(db.Model):

	__tablename__ = 'items'

	id = db.Column(db.Integer, primary_key = True)
	desc = db.Column(db.String(256), unique = True, nullable = False)
	discrete = db.Column(db.Boolean, nullable = False)
	quantity = db.Column(db.Float, default = 0)
	price = db.Column(db.Float, nullable = False)
	measurement = db.Column(db.String(10), nullable = True)

class ItemSchema(ma.Schema):
	class Meta:
		fields = ('id', 'desc', 'discrete', 'quantity', 'price', 'measurement')

