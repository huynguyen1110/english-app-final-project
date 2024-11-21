from flask import Blueprint, jsonify, request
from service.video_service import VideoService

video_controller = Blueprint("video_controller", __name__, url_prefix="/video")

@video_controller.route("/get-script", methods=["GET"])
def get_script():
    """API lấy thông tin user theo user_id"""
    # Lấy query param 'video_id'
    video_id = request.args.get("video_id")  # None nếu không có param
    if not video_id:
        return jsonify({"message": "Missing video_id parameter"}), 400

    stranscript = VideoService.get_script(video_id)

    if not stranscript:
        return jsonify({"message": "no script available"}), 400

    return jsonify(stranscript), 200

