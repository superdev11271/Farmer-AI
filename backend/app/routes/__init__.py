from .auth import auth
from .invoice import invoice
from .document import document

def register_routes(app):
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(invoice, url_prefix='/api/invoice')
    app.register_blueprint(document, url_prefix='/api/document')