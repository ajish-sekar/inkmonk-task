from __future__ import print_function
from flask import request, jsonify, make_response
import json
import sys
import random
import string
import hashlib

from . import auth
from ..models import User
from .. import db
from ..models import UserSchema

user_schema = UserSchema()
users_schema = UserSchema(many = True)


@auth.route("/register", methods=['POST'])
def register():
	user_name = request.form.get('user_name')
	password = request.form.get('password')

	if user_name == None or password == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	try :
		st = password.encode('utf-8')
		pwd_hash = hashlib.md5(st).hexdigest()
		user = User(username = user_name, password_hash = pwd_hash)
		db.session.add(user)
		db.session.commit()
		return make_response(jsonify({'status': "Success", 'message': "User registered"}), 200)
	except Exception as e:
		return make_response(jsonify({'status': "Failure", 'message': e}), 500)

@auth.route("/login", methods=['POST'])
def login():
	user_name = request.form.get('user_name')
	pwd = request.form.get('password')

	if user_name == None or pwd == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	st = pwd.encode('utf-8')
	pwd_hash = hashlib.md5(st).hexdigest()

	try:
		user = User.query.filter_by(username = user_name).first()
		print("{}".format(pwd_hash), file=sys.stderr);
		print("{}".format(user.password_hash), file=sys.stderr);
		if user == None:
			return make_response(jsonify({'status': "Failure", 'message': "Username does not exist"}), 200)
		if user.password_hash == pwd_hash:
			token = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(24))
			st1 = token.encode('utf-8');
			user.user_token = hashlib.md5(st1).hexdigest()
			db.session.commit()
			result = user_schema.dump(user)
			return make_response(jsonify({'status': "Success", 'message': result.data}), 200)
		else:
			return make_response(jsonify({'status': "Failure", 'message': "Invalid Password"}), 200)

	except Exception as e:
		return make_response(jsonify({'status': "Failure", 'message': e}), 500)

@auth.route("/logout", methods=['POST'])
def logout():
	user_name = request.form.get('user_name')

	if user_name == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	try:
		user = User.query.filter_by(username = user_name).first()
		user.user_token = None
		db.session.commit()
		return make_response(jsonify({'status': "Success", 'message': "User Logged Out"}), 200)
	except Exception as e:
		return make_response(jsonify({'status': "Failure", 'message': "An error ocurred"}), 500)