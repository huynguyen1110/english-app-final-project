import os

from flask import Blueprint, jsonify, request, send_from_directory
from service.google_service import GoogleService

google_controller = Blueprint("google_controller", __name__, url_prefix="/google")

@google_controller.route("/convert-to-speech", methods=["POST"])
def text_to_speech():
    try:
        data = request.get_json()
        text = data.get("text")
        language = data.get("language", "en")  # Mặc định là tiếng Anh

        if not text:
            return jsonify({"message": "Text is required"}), 400

        # Gọi hàm trong service để chuyển văn bản thành giọng nói
        output_file = GoogleService.text_to_speech(text, language, False)

        # Trả về file âm thanh cho client (bạn có thể gửi file dưới dạng đính kèm)
        return jsonify({"message": "Text to speech conversion successful", "file": output_file}), 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

