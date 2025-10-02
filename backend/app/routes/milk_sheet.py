from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.db import db
from app.models.milk_sheet import MilkSheet

milk_sheet = Blueprint('milk_sheet', __name__)


@milk_sheet.route('/<string:identifier>', methods=['GET'])
@jwt_required()
def get_sheet(identifier):
    sheet = MilkSheet.query.filter_by(category_identifier=identifier).order_by(MilkSheet.updated_at.desc()).first()
    if not sheet:
        return jsonify({"category_identifier": identifier, "data": None}), 200
    return jsonify(sheet.to_dict()), 200


@milk_sheet.route('/', methods=['POST'])
@jwt_required()
def save_sheet():
    payload = request.json or {}
    identifier = payload.get('category_identifier')
    data = payload.get('data')  # stringified JSON from client

    if not identifier:
        return jsonify({"error": "category_identifier is required"}), 400
    if data is None:
        return jsonify({"error": "data is required"}), 400

    sheet = MilkSheet.query.filter_by(category_identifier=identifier).first()
    if sheet:
        sheet.data = data
    else:
        sheet = MilkSheet(category_identifier=identifier, data=data)
        db.session.add(sheet)

    db.session.commit()
    return jsonify(sheet.to_dict()), 200


