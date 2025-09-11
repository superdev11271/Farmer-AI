from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import Invoice
from app.db import db

invoice = Blueprint('invoice', __name__)
def safe_float(value):
    """Convert string to float; return None if empty or invalid."""
    if value is None or value == '' or value == 'null':
        return None  # or return 0.0 if preferred
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


@invoice.route('/', methods=['POST'])
@jwt_required()
def create_or_replace_invoices():
    data = request.json
    
    identifier = data.get('category_identifier')
    items = data.get('items', [])

    if not identifier:
        return jsonify({"error": "category_identifier is required"}), 400

    # Delete existing invoices
    Invoice.query.filter_by(category_identifier=identifier).delete()
    db.session.commit()  # Optional: commit delete before insert

    new_invoices = []
    for item in items:
        invoice = Invoice(
            category_identifier=item.get("category_identifier"),
            datum=item.get("datum"),
            omschrijving=item.get("omschrijving"),
            kg=safe_float(item.get("kg")),
            mk=safe_float(item.get("mk")),
            jv=safe_float(item.get("jv")),
            mv=safe_float(item.get("mv")),
            zk=safe_float(item.get("zk")),
            bedrag=safe_float(item.get("bedrag")),  # e.g., "5" → 5.0
            btw=safe_float(item.get("btw"))         # e.g., 21 → 21.0
        )
        db.session.add(invoice)

    try:
        db.session.commit()
        return jsonify({"message": f"{len(items)} invoices added for identifier '{identifier}'"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save invoices", "details": str(e)}), 500

@invoice.route('/<string:identifier>', methods=['GET'])
@jwt_required()
def get_invoices_by_identifier(identifier):
    invoices = Invoice.query.filter_by(category_identifier=identifier).all()
    return jsonify([inv.to_dict() for inv in invoices])

@invoice.route("/", methods=["GET"])
@jwt_required()
def list_documents():
    invoices = Invoice.query.order_by(Invoice.created_at.desc()).all()
    return jsonify([d.to_dict() for d in invoices])