from datetime import datetime
from entity import db
class Audio(db.Model):
    __tablename__ = 'audio'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(255), nullable=False)  # Tên file
    file_data = db.Column(db.LargeBinary, nullable=False)  # Nội dung file (binary)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Thời gian tạo

    def __init__(self, filename, file_data):
        self.filename = filename
        self.file_data = file_data

    def to_dict(self):
        """Convert the entity to a dictionary for JSON responses"""
        return {
            "id": self.id,
            "filename": self.filename,
            "file_url": self.file_url,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
