from flask import Blueprint, jsonify
from service.user_service import UserService

user_controller = Blueprint("user_controller", __name__, url_prefix="/users")

@user_controller.route("/", methods=["GET"])
def get_user():
    """API lấy thông tin user theo user_id"""
    user, error = UserService.get_user()
    if error:
        return jsonify({"message": error}), 404
    return jsonify(user), 200
