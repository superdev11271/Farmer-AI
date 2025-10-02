from app.db import db
from datetime import datetime


class MilkSheet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_identifier = db.Column(db.String, nullable=False, index=True)
    # Store sheet state as JSON/string to avoid many columns and allow flexibility
    data = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "category_identifier": self.category_identifier,
            "data": self.data,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


