class UserService:
    @staticmethod
    def get_user():
        """Xử lý logic nghiệp vụ để lấy thông tin user"""
        user = {
            "name": "huy",
            "age": "18"
        }
        if not user:
            return None, "User not found"
        return user, None
