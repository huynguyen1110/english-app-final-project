from flask import Flask
from controller.user_controller import user_controller
from controller.video_controller import video_controller

app = Flask(__name__)

# Register controller
app.register_blueprint(user_controller)
app.register_blueprint(video_controller)

if __name__ == "__main__":
    app.run(debug=True)