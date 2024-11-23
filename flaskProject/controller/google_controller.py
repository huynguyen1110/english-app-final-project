import io
import os

import requests
from flask import Blueprint, jsonify, request

from service.google_service import GoogleService

google_controller = Blueprint("google_controller", __name__, url_prefix="/google")


@google_controller.route("/convert-to-speech", methods=["POST"])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text')
        language = data.get('language', 'en')  # Mặc định là 'en'
        slow = data.get('slow', False)  # Mặc định là False

        # Kiểm tra nếu 'text' không được cung cấp
        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Gọi dịch vụ chuyển văn bản thành giọng nói
        response = GoogleService.text_to_speech(text, language, slow)

        if response:
            # Nếu file được tạo thành công và đường dẫn file hợp lệ
            return response, 200
        else:
            return jsonify({'error': 'Failed to convert text to speech'}), 500
    except Exception as e:
        # Xử lý ngoại lệ nếu có lỗi xảy ra
        return jsonify({'error': str(e)}), 500


@google_controller.route("/extract-text-from-image", methods=["POST"])
def extract_text_from_image():
    try:
        # Lấy URL từ query parameters
        image_url = request.args.get('url')
        if not image_url:
            return jsonify({'error': 'No URL provided'}), 400

        # Gọi hàm xử lý ảnh của bạn
        text = GoogleService.image_to_text(image_url)

        return jsonify({'extracted_text': text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
