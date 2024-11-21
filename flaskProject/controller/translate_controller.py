from flask import Blueprint, jsonify, request
from service.translate_service import TranslateService

translate_controller = Blueprint("translate_controller", __name__, url_prefix="/translate")


@translate_controller.route("", methods=["POST"])
def translate():
    """
    API dịch văn bản từ ngôn ngữ nguồn sang ngôn ngữ đích.
    Lấy 'text' từ body, 'source' và 'target' từ query parameters.
    """
    # Lấy dữ liệu từ body
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    text = data["text"]

    # Lấy ngôn ngữ nguồn và đích từ query params
    source = request.args.get("source", "auto")  # Mặc định 'auto' nếu không có
    target = request.args.get("target", "vi")  # Mặc định dịch sang tiếng Anh

    # Gọi dịch vụ để dịch
    response = TranslateService.translate_text(text, source, target)

    return jsonify(response), 200
