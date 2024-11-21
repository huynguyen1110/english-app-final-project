from flask import Flask
from controller.user_controller import user_controller
from controller.video_controller import video_controller
from controller.translate_controller import translate_controller

app = Flask(__name__)

# Register controller
app.register_blueprint(user_controller)
app.register_blueprint(video_controller)
app.register_blueprint(translate_controller)

if __name__ == "__main__":
    app.run(host="0.0.0.0" ,debug=True)