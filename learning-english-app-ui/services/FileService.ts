import axios from "axios";
import {BASE_URL, CHAT_GPT_API, FILE_ENPOINT} from "../utils/API";

export const updaloadImage = async (file: any, folderName: string) => {
    const formData = new FormData();
    formData.append('file', {
        uri: file,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg'
    });
    formData.append('folder', folderName);

    const options = {
        method: 'POST',
        url: BASE_URL.concat(FILE_ENPOINT.UPLOAD_IMAGE),
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error("err while upload image",  error);
    }
}
