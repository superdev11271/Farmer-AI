from app.db import db
from datetime import datetime

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_identifier = db.Column(db.String, nullable=False)
    datum = db.Column(db.String)  # or db.Date
    omschrijving = db.Column(db.String)
    kg = db.Column(db.Float, nullable=True)
    mk = db.Column(db.Float, nullable=True)
    jv = db.Column(db.Float, nullable=True)
    mv = db.Column(db.Float, nullable=True)
    zk = db.Column(db.Float, nullable=True)
    bedrag = db.Column(db.Float, nullable=True)
    btw = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "category_identifier": self.category_identifier,
            "datum": self.datum,
            "omschrijving": self.omschrijving,
            "kg": self.kg,
            "mk": self.mk,
            "jv": self.jv,
            "mv": self.mv,
            "zk": self.zk,
            "bedrag": self.bedrag,
            "btw": self.btw,
            "created_at": self.created_at.isoformat()
        }