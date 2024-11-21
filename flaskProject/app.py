from flask import Flask
from controller.user_controller import user_controller
from controller.video_controller import video_controller
from controller.translate_controller import translate_controller
from controller.google_controller import google_controller

from entity import audio, db

app = Flask(__name__)

# Cấu hình kết nối MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Huynguyen11102002@localhost/audio-db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()  # Tạo bảng trong cơ sở dữ liệu nếu chưa tồn tại

# Register controller
app.register_blueprint(user_controller)
app.register_blueprint(video_controller)
app.register_blueprint(translate_controller)
app.register_blueprint(google_controller)

if __name__ == "__main__":
    app.run(host="0.0.0.0" ,debug=True)