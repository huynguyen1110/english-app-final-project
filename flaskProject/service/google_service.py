import os
from gtts import gTTS


class GoogleService:

    @staticmethod
    def text_to_speech(text, language, slow=False):
        try:
            # Đường dẫn lưu file âm thanh
            output_file = "output.mp3"

            # Tạo đối tượng gTTS để chuyển văn bản thành giọng nói
            tts = gTTS(text=text, lang=language, slow=slow)

            # Lưu file âm thanh
            tts.save(output_file)

            # Kiểm tra nếu file đã được lưu thành công
            if os.path.exists(output_file):
                return output_file
            else:
                raise Exception("Failed to save the audio file.")
        except Exception as e:
            print(f"Error in converting text to speech: {str(e)}")
            return None


