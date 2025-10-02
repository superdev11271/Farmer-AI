from .auth import auth
from .invoice import invoice
from .document import document
from .prompt import prompt
from .milk_sheet import milk_sheet

def register_routes(app):
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(invoice, url_prefix='/api/invoice')
    app.register_blueprint(document, url_prefix='/api/document')
    app.register_blueprint(prompt, url_prefix='/api')
    app.register_blueprint(milk_sheet, url_prefix='/api/milk-sheet')