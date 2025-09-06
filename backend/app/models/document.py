from app.db import db
from datetime import datetime


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_name = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Integer, default=1)  # 1=uploaded, 2=processed, 3=archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "original_name": self.original_name,
            "path": self.path,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }