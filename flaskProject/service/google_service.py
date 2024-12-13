import io
import os
from io import BytesIO

import cv2
import httpx
import numpy as np
import requests
from flask import send_file, jsonify
from gtts import gTTS

from PIL import Image, ImageFilter
import pytesseract
import easyocr
from io import BytesIO

reader = easyocr.Reader(['en', 'vi'])

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

    @staticmethod
    def image_to_text(image_url, is_preprocessed):
        try:

            # Tải ảnh từ URL
            response = requests.get(image_url)
            response.raise_for_status()

            # Mở ảnh bằng Pillow
            image = Image.open(BytesIO(response.content))
            image_np = np.array(image)

            # GoogleService.preprocess_image(image)

            if is_preprocessed == "yes":
                result = reader.readtext(image_np)
                text = " ".join([text[1] for text in result])
                return text

            # Trích xuất văn bản
            text = pytesseract.image_to_string(image, lang='Vietnamese+en')
            return text
        except Exception as e:
            return str(e)

    @staticmethod
    def convert_to_binary_image(image, threshold=128):
        """
        Chuyển đổi hình ảnh sang ảnh nhị phân (Binary Image).

        :param image: Ảnh đầu vào dưới dạng đối tượng Pillow.
        :param threshold: Ngưỡng để chuyển đổi ảnh sang nhị phân (mặc định là 128).
        :return: Ảnh nhị phân dưới dạng đối tượng Pillow.
        """
        try:
            # Chuyển ảnh sang ảnh grayscale (đơn sắc)
            grayscale_image = image.convert('L')

            # Chuyển ảnh grayscale thành mảng numpy
            np_image = np.array(grayscale_image)

            # Áp dụng ngưỡng để chuyển ảnh thành nhị phân
            binary_image = (np_image > threshold) * 255

            # Chuyển lại thành ảnh Pillow
            binary_image = Image.fromarray(binary_image.astype(np.uint8))

            return binary_image

        except Exception as e:
            print(f"Error converting to binary image: {str(e)}")
            return None

    @staticmethod
    def dilation(image, kernel_size=2):
        """
        Thực hiện phép giãn (Dilation) trên ảnh nhị phân.

        :param image: Ảnh đầu vào (PIL image).
        :param kernel_size: Kích thước của kernel (mặc định là 2).
        :return: Ảnh đã giãn (PIL image).
        """

        # Chuyển ảnh PIL sang numpy array
        np_image = np.array(image.convert('L'))  # Chuyển sang ảnh grayscale

        # Áp dụng threshold để binarize ảnh
        _, binary_image = cv2.threshold(np_image, 128, 255, cv2.THRESH_BINARY)

        # Tạo kernel hình vuông (mảng 2D)
        kernel = np.ones((kernel_size, kernel_size), np.uint8)

        # Áp dụng phép giãn (Dilation)
        dilated_image = cv2.dilate(binary_image, kernel, iterations=1)

        # Chuyển lại ảnh numpy thành PIL image
        dilated_image_pil = Image.fromarray(dilated_image)

        return dilated_image_pil

    @staticmethod
    def erosion(image, kernel_size=2):
        """
        Thực hiện phép nở (Erosion) trên ảnh nhị phân.

        :param image: Ảnh đầu vào (PIL image).
        :param kernel_size: Kích thước của kernel (mặc định là 2).
        :return: Ảnh đã nở (PIL image).
        """
        # Chuyển ảnh PIL sang numpy array
        np_image = np.array(image.convert('L'))  # Chuyển sang ảnh grayscale

        # Áp dụng threshold để binarize ảnh
        _, binary_image = cv2.threshold(np_image, 128, 255, cv2.THRESH_BINARY)

        # Tạo kernel hình vuông (mảng 2D)
        kernel = np.ones((kernel_size, kernel_size), np.uint8)

        # Áp dụng phép nở (Erosion)
        eroded_image = cv2.erode(binary_image, kernel, iterations=1)

        # Chuyển lại ảnh từ numpy array sang PIL image
        eroded_image_pil = Image.fromarray(eroded_image)

        return eroded_image_pil

    @staticmethod
    def correct_skew(image):
        """
        Sửa độ nghiêng của ảnh mà không làm mất thông tin.

        :param image: Đối tượng ảnh Pillow (PIL).
        :return: Đối tượng ảnh Pillow đã sửa độ nghiêng.
        """
        # Chuyển ảnh Pillow thành numpy array (OpenCV xử lý ảnh dưới dạng này)
        np_image = np.array(image)

        # Chuyển ảnh sang ảnh xám (grayscale)
        gray = cv2.cvtColor(np_image, cv2.COLOR_RGB2GRAY)

        # Chuyển ảnh xám sang nhị phân (b&w) để dễ phát hiện văn bản
        _, binary_image = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY_INV)

        # Tìm các tọa độ của các pixel chứa văn bản (không phải background)
        coords = np.column_stack(np.where(binary_image > 0))

        # Tính toán góc xoay bằng cách dùng hàm minAreaRect để tìm góc của bounding box
        angle = cv2.minAreaRect(coords)[-1]

        # Đảm bảo góc nằm trong khoảng (-90, 0) độ
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        # Tính toán lại kích thước ảnh sau khi xoay để không bị mất dữ liệu
        (h, w) = binary_image.shape[:2]
        center = (w // 2, h // 2)
        rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)

        # Tính toán kích thước mới cho ảnh sau khi xoay
        abs_cos = abs(rotation_matrix[0, 0])
        abs_sin = abs(rotation_matrix[0, 1])
        new_w = int(h * abs_sin + w * abs_cos)
        new_h = int(h * abs_cos + w * abs_sin)

        # Cập nhật phép xoay với kích thước mới
        rotation_matrix[0, 2] += (new_w / 2) - center[0]
        rotation_matrix[1, 2] += (new_h / 2) - center[1]

        # Xoay ảnh mà không bị mất thông tin
        rotated_image = cv2.warpAffine(np_image, rotation_matrix, (new_w, new_h), flags=cv2.INTER_CUBIC,
                                       borderMode=cv2.BORDER_REPLICATE)
        # Chuyển lại ảnh đã sửa từ numpy array sang Pillow
        return Image.fromarray(rotated_image).transpose(Image.ROTATE_90)

    @staticmethod
    def reduce_noise_pillow(image, size=3):
        """
        Áp dụng Median Filter để giảm nhiễu trong ảnh sử dụng Pillow.

        :param image: Đối tượng ảnh Pillow (PIL).
        :param size: Kích thước của filter (mặc định là 3x3).
        :return: Ảnh đã giảm nhiễu.
        """
        # Áp dụng Median Filter để loại bỏ nhiễu
        return image.filter(ImageFilter.MedianFilter(size=size))

    @staticmethod
    async def upload_image(image: Image.Image):
        """
        Tải ảnh đã xử lý lên API ngoài.
        """
        try:
            # Lưu ảnh đã xử lý vào bộ nhớ (file-like object)
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)  # Reset con trỏ về đầu file

            # Gửi ảnh lên API
            url = "http://localhost:9000/api/v1/files/upload/image"
            async with httpx.AsyncClient() as client:
                # Tạo dữ liệu form để gửi lên server
                data = {'folder': 'example-images'}  # Thêm folder name vào form data
                files = {'file': ('processed_image.png', img_byte_arr, 'image/png')}

                # Gửi POST request
                response = await client.post(url, data=data, files=files)

            # Kiểm tra phản hồi từ API
            response.raise_for_status()  # Tạo exception nếu status_code không phải 2xx

            return {"message": "Upload successful", "data": response.json()}

        except httpx.HTTPStatusError as e:
            # Lỗi HTTP, ví dụ lỗi 400, 500
            return {"message": "Upload failed", "error": str(e)}

        except httpx.RequestError as e:
            # Lỗi kết nối hoặc yêu cầu không hợp lệ
            return {"message": "Network error", "error": str(e)}

        except Exception as e:
            # Bắt tất cả các lỗi không mong đợi
            return {"message": "Unknown error occurred", "error": str(e)}

    @staticmethod
    async def preprocess_image(image_url, process_name):
        try:
            # Tải ảnh từ URL
            response = requests.get(image_url)
            response.raise_for_status()

            # Mở ảnh bằng Pillow
            image = Image.open(BytesIO(response.content))

            if process_name == "BINARISIZE":
                imageResult = GoogleService.convert_to_binary_image(image)
                if (imageResult):
                    return await GoogleService.upload_image(imageResult)
                return
            elif process_name == "DILATION":
                # LAM MO ANH
                imageResult = GoogleService.dilation(image)
                if (imageResult):
                    return await GoogleService.upload_image(imageResult)
                return
            elif process_name == "EROSION":
                imageResult = GoogleService.erosion(image)
                if (imageResult):
                    return await GoogleService.upload_image(imageResult)
                return
            elif process_name == "NOISE_REDUCTION":
                imageResult = GoogleService.reduce_noise_pillow(image)
                if (imageResult):
                    return await GoogleService.upload_image(imageResult)
                return
            elif process_name == "CORRECT_SKEW":
                imageResult = GoogleService.correct_skew(image)
                if (imageResult):
                    return await GoogleService.upload_image(imageResult)
                return
            else:
                print("Unknown process")

        except Exception as e:
            return str(e)
