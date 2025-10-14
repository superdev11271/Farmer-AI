from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import os, uuid
from datetime import datetime
from app.models import Invoice
from app.models import Document
from app.models import Prompt
from app.db import db
import json
import openai
from openai import OpenAI
import fitz
import base64
from app.routes.data.prompt import get_prompt
import threading
from dotenv import load_dotenv
load_dotenv()

document = Blueprint("document", __name__)

ALLOWED_EXTENSIONS = {"pdf"}


proxy_url = os.getenv("PROXY_URL")
os.environ["HTTP_PROXY"] = proxy_url
os.environ["HTTPS_PROXY"] = proxy_url

openai.proxy = {
    "http": proxy_url,
    "https": proxy_url,
}

OPEN_API_KEY = os.getenv("OPENAI_KEY")

def process_pdf(path, prompt):
    try:
        print(" started")
        # Open PDF
        doc = fitz.open(path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return None

    image_messages = []

    # Convert pages to base64 images
    try:
        for _, page in enumerate(doc, start=1):
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            image_base64 = base64.b64encode(img_bytes).decode("utf-8")
            image_messages.append(
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
            )
    except Exception as e:
        print(f"Error converting PDF pages to images: {e}")
        return None

    # Call OpenAI API
    try:
        client = OpenAI(api_key=OPEN_API_KEY)
        response = client.chat.completions.create(
            model="gpt-5",
            messages=[
                {"role": "system", "content": prompt},
                # {"role": "system", "content": "	coopertex-d is not dipmiddelen"},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Parse all these pages and return the JSON array."},
                        *image_messages
                    ]
                }
            ]
        )
    except Exception as e:
        print(f"Error calling GPT API: {e}")
        return None

    # Parse JSON response
    try:
        json_str = response.choices[0].message.content
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error parsing response: {e}")
        return None

    return data

def process_pdf_thread(path, prompt, doc_id, callback):
    print("process started")
    from flask import current_app
    app = current_app._get_current_object()
    def run():
        # push app context for this thread
        with app.app_context():
            doc = Document.query.get_or_404(doc_id)

            doc.status = 2

            db.session.commit()

            result = process_pdf(path, prompt)
            if callback:
                callback(result, doc_id)

    thread = threading.Thread(target=run)
    thread.start()
    return thread

def safe_float(value):
    """Convert string to float; return None if empty or invalid."""
    if value is None or value == '' or value == 'null':
        return None  # or return 0.0 if preferred
    try:
        return float(value)
    except (ValueError, TypeError):
        return None
# Example callback function
def handle_result(data, doc_id):
    doc = Document.query.get_or_404(doc_id)
    if data is None:
        print("Processing failed.")

        doc.status = 4

        db.session.commit()
    else:
        print("Processing succeeded. Result:")
        for item in data:
            if item.get("category_identifier"):
                sheet = Invoice(category_identifier=item.get("category_identifier"), data=json.dumps(item))
                db.session.add(sheet)
        try:
            db.session.commit()
            
            doc.status = 3

            db.session.commit()
        except Exception as e:
            print(e)
            db.session.rollback()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@document.route("/", methods=["POST"])
@jwt_required()
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only PDF allowed"}), 400

    original_name = secure_filename(file.filename)
    ext = original_name.rsplit(".", 1)[1].lower()

    # Generate unique filename
    unique_filename = f"{uuid.uuid4().hex}.{ext}"

    upload_dir = os.path.join(current_app.root_path, current_app.config['UPLOAD_FOLDER'])
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)
    file.save(file_path)

    prompts = Prompt.query.all()
    prompt = get_prompt(prompts)
    # Start thread to process PDF

    # Save to DB
    doc = Document(
        original_name=original_name,
        path=current_app.config['UPLOAD_FOLDER'] + "/" + unique_filename,
        status=1,
        created_at=datetime.utcnow()
    )
    db.session.add(doc)
    db.session.commit()

    process_pdf_thread(file_path, prompt, doc.id, handle_result)

    return jsonify(doc.to_dict()), 201


@document.route("/", methods=["GET"])
@jwt_required()
def list_documents():
    docs = Document.query.order_by(Document.created_at.desc()).all()
    return jsonify([d.to_dict() for d in docs])


@document.route("/<int:doc_id>", methods=["PUT"])
@jwt_required()
def update_document(doc_id):
    data = request.json
    doc = Document.query.get_or_404(doc_id)

    if "status" in data:
        doc.status = data["status"]

    db.session.commit()
    return jsonify(doc.to_dict())


@document.route("/<int:doc_id>", methods=["DELETE"])
@jwt_required()
def delete_document(doc_id):
    doc = Document.query.get_or_404(doc_id)
    path = os.path.join(current_app.root_path, doc.path)
    if os.path.exists(path):
        os.remove(path)

    db.session.delete(doc)
    db.session.commit()

    return jsonify({"message": f"Document {doc_id} deleted"})


@document.route("/remove_all", methods=["DELETE"])
@jwt_required()
def remove_all_documents():
    docs = Document.query.all()
    for d in docs:
        path = os.path.join(current_app.root_path, d.path)
        if os.path.exists(path):
            os.remove(path)
        db.session.delete(d)
    db.session.commit()
    return jsonify({"message": "All documents removed"})
