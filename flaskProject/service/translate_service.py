from googletrans import Translator


class TranslateService:
    @staticmethod
    def translate_text(text: str, source_language: str, target_language: str) -> str:
        """
        Dịch văn bản từ ngôn ngữ nguồn sang ngôn ngữ đích.

        :param text: Văn bản cần dịch
        :param source_language: Mã ngôn ngữ nguồn (vd: 'en' cho tiếng Anh)
        :param target_language: Mã ngôn ngữ đích (vd: 'vi' cho tiếng Việt)
        :return: Văn bản đã được dịch
        """
        try:
            # Khởi tạo đối tượng Translator
            translator = Translator()

            # Dịch văn bản
            result = translator.translate(text, src=source_language, dest=target_language)

            return result.text
        except Exception as e:
            # Trả về lỗi nếu dịch thất bại
            return f"Error: {str(e)}"