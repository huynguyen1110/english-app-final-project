import os
from gtts import gTTS

from entity import db
from entity.audio import Audio


class GoogleService:

    # @staticmethod
    # def text_to_speech(text, language, slow=False):
    #     try:
    #         # Đường dẫn lưu file âm thanh
    #         output_file = "output.mp3"
    #
    #         # Tạo đối tượng gTTS để chuyển văn bản thành giọng nói
    #         tts = gTTS(text=text, lang=language, slow=slow)
    #
    #         # Lưu file âm thanh
    #         tts.save(output_file)
    #
    #         # Kiểm tra nếu file đã được lưu thành công
    #         if os.path.exists(output_file):
    #             return output_file
    #         else:
    #             raise Exception("Failed to save the audio file.")
    #     except Exception as e:
    #         print(f"Error in converting text to speech: {str(e)}")
    #         return None

    @staticmethod
    def text_to_speech(text, language, slow=False):
        try:
            # Tên file tạm thời
            output_file = "output.mp3"

            # Tạo file âm thanh từ văn bản
            tts = gTTS(text=text, lang=language, slow=slow)
            tts.save(output_file)

            # Kiểm tra file đã được lưu thành công
            if os.path.exists(output_file):
                # Đọc nội dung file dưới dạng binary
                with open(output_file, "rb") as audio_file:
                    file_data = audio_file.read()

                # Lưu vào database
                new_audio = Audio(filename=output_file, file_data=file_data)
                db.session.add(new_audio)
                db.session.commit()

                # Xóa file tạm thời nếu không cần thiết
                os.remove(output_file)

                return new_audio.id  # Trả về ID của bản ghi mới trong DB
            else:
                raise Exception("Failed to save the audio file.")
        except Exception as e:
            print(f"Error in converting text to speech: {str(e)}")
            return None


