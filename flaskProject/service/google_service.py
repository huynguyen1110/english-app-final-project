import os
from io import BytesIO

import requests
from flask import request, send_file, jsonify
from gtts import gTTS

from entity import db
from entity.audio import Audio


class GoogleService:
    @staticmethod
    def text_to_speech(text, language, slow):

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        try:
            # Tạo đối tượng gTTS để chuyển văn bản thành giọng nói
            tts = gTTS(text=text, lang=language, slow=slow)

            # Lưu vào bộ nhớ thay vì file
            mp3_file = BytesIO()
            # mp3_file.seek(0)  # Đặt con trỏ file về đầu

            # Trả về file MP3 dưới dạng response
            return send_file(mp3_file, mimetype='audio/mp3', as_attachment=True, download_name="output.mp3")

        except Exception as e:
            # Bắt lỗi nếu có và trả về thông báo lỗi
            return jsonify({'error': str(e)}), 500
