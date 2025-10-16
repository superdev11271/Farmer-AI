from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import true
from app.db import db
from app.models.invoice import Invoice
import json
invoice = Blueprint('invoice', __name__)


@invoice.route('/<string:identifier>', methods=['GET'])
@jwt_required()
def get_sheet(identifier):
    try:
        rows = (
            Invoice.query.filter_by(category_identifier=identifier)
            .order_by(Invoice.updated_at.desc())
            .all()
        )

        if not rows:
            return jsonify({"category_identifier": identifier, "data": []}), 200

        # Reconstruct list of dicts
        data_list = [{**json.loads(row.data), "id": row.id, "source_doc": row.source_doc, "category_identifier": row.category_identifier} for row in rows]

        return jsonify({"data":data_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@invoice.route('/', methods=['POST'])
@jwt_required()
def save_sheet():
    try:
        payload = request.json or {}
        
        identifier = payload.get('category_identifier')
        data = payload.get('data')  # stringified JSON from client

        if not identifier:
            return jsonify({"error": "category_identifier is required"}), 400
        if data is None:
            return jsonify({"error": "data is required"}), 400

        # Delete existing + insert new in one transaction
        Invoice.query.filter_by(category_identifier=identifier).delete()

        for dt in data:
            tmp = dt.copy()
            del tmp["id"]
            del tmp["category_identifier"]
            del tmp["source_doc"]
            sheet = Invoice(category_identifier=dt["category_identifier"], source_doc = dt["source_doc"],  data=json.dumps(tmp))
            db.session.add(sheet)

        db.session.commit()
        return jsonify({"success": True}), 200

    except Exception as e:
        db.session.rollback()  # roll back if anything failed
        return jsonify({"error": str(e)}), 500
