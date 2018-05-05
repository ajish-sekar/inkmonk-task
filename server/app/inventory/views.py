from __future__ import print_function
from flask import request, jsonify, make_response
import json
import sys

from . import inventory
from ..models import Item
from .. import db
from ..models import ItemSchema
from ..models import User

item_schema = ItemSchema()
items_schema = ItemSchema(many = True)

def verify(user, token):
	person = User.query.filter_by(username = user).first()
	print("{}".format(person.user_token))
	print("{}".format(token))
	if person == None or person.user_token != token:
		return False

	return True
@inventory.route('/create_item', methods=['POST'])
def create_item():

	user = request.form.get("user_name");
	token = request.form.get('token');
	if not verify(user,token) or user == None or token == None:
		return make_response(jsonify({"status": "Failure", "message": "Unauthorized Access"}), 200)
	discrete = request.form.get('discrete')
	desc = request.form.get('desc')
	price = request.form.get('price')
	quantity = request.form.get('quantity')
	measurement = request.form.get('measurement')

	if desc == None or price == None or discrete == None or quantity == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	if discrete=="false" and measurement == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	if discrete=="true":
		item = Item(desc = desc, discrete = 1, quantity = quantity, price = price)
		try:	
			db.session.add(item)
			db.session.commit()
			return make_response(jsonify({'status': "Success", 'message': "Item created" }), 201)
		except Exception as e:
			return make_response(jsonify({'status': "Failure", 'message': "An error ocurred"}), 500)
	else:
		item = Item(desc = desc, discrete = 0, quantity = quantity, price = price, measurement = measurement)
		try:
			db.session.add(item)
			db.session.commit()
			return make_response(jsonify({'status': "Success", 'message': "Item created" }), 201)
		except Exception as e:
			return make_response(jsonify({'status': "Failure", 'message': "An error ocurred"}), 500)


@inventory.route("/all_items", methods=['POST'])
def all_items():
	user = request.form.get("user_name");
	token = request.form.get('token');
	if not verify(user,token) or user == None or token == None:
		return make_response(jsonify({"status": "Failure", "message": "Unauthorized Access"}), 200)
	try:
		items = Item.query.all()
		result = items_schema.dump(items)
		return make_response(jsonify({'status': "Success", 'message': result.data}), 200)
	except Exception as e:
		return make_response(jsonify({'status': "Failure", 'message': e}), 500)

@inventory.route("/add_stock", methods=['POST'])
def add_stock():
	user = request.form.get("user_name");
	token = request.form.get('token');
	if not verify(user,token) or user==None or token==None:
		return make_response(jsonify({"status": "Failure", "message": "Unauthorized Access"}), 200)
	id = request.form.get('id')
	quantity = request.form.get('quantity')

	if id == None or quantity == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	try:
		item = Item.query.filter_by(id=id).first()
		item.quantity = quantity
		db.session.commit()
		return make_response(jsonify({'status': "Success", 'message': "Stock has been updated"}), 200)
	except Exception as e:
		return make_response(jsonify({'status': "Failure", 'message': "An error has ocurred"}), 500)

@inventory.route('/remove_stock', methods=['POST'])
def remove_stock():
	user = request.form.get("user_name");
	token = request.form.get('token');
	if not verify(user,token) or user==None or token==None:
		return make_response(jsonify({"status": "Failure", "message": "Unauthorized Access"}), 200)
	ids = request.form.getlist('ids')
	quantities = request.form.getlist('quantities')
	print("{}".format(ids), file = sys.stderr)
	print("{}".format(quantities), file = sys.stderr)
	if ids == None or quantities == None:
		return make_response(jsonify({'status': "Failure", 'message': "Missing data"}), 400)

	try:

		for index, obj in enumerate(ids):
			if obj != None:
				print("{}".format(index), file = sys.stderr)
				print("{}".format(obj), file = sys.stderr)
				item = Item.query.filter_by(id = obj).first()
				print("{}".format(item), file = sys.stderr)
				print("{}".format(quantities[index]), file = sys.stderr)
				item.quantity = item.quantity - float(quantities[index])
				db.session.commit()

		return make_response(jsonify({'status': "Success", 'message': "Stock has been updated"}), 200)
	
	except Exception as e:
		return make_response(jsonify({'status': "Failure", 'message': e}), 500)


