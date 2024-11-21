import io
import os

from flask import Blueprint, jsonify, request, send_from_directory, send_file

from entity.audio import Audio
from service.google_service import GoogleService

google_controller = Blueprint("google_controller", __name__, url_prefix="/google")

@google_controller.route("/convert-to-speech", methods=["POST"])
def text_to_speech():
    data = request.json
    text = data.get('text')
    language = data.get('language', 'en')
    slow = data.get('slow', False)

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    audio_id = GoogleService.text_to_speech(text, language, slow)
    if audio_id:
        return jsonify({'message': 'Audio saved successfully', 'audio_id': audio_id}), 201
    else:
        return jsonify({'error': 'Failed to convert text to speech'}), 500

@google_controller.route("/text-to-speech", methods=["GET"])
def get_audio():
    audio_id = request.args.get("audio_id")  # None nếu không có param
    audio = Audio.query.get(audio_id)
    if not audio:
        return jsonify({'error': 'Audio not found'}), 404

    # Tạo file từ dữ liệu binary
    return send_file(
        io.BytesIO(audio.file_data),
        mimetype='audio/mpeg',
        as_attachment=False,  # Không tải xuống, chỉ phát trực tiếp
        download_name=audio.filename
    )


