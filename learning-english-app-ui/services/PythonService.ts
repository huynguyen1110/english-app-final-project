import {BASE_PYTHON_URL, PYTHON_ENTPOINT} from "../utils/API";
import axios from "axios";

export const getYtbVideoScriptService = async (videoId: string) => {
    const options = {
        method: 'GET',
        url: BASE_PYTHON_URL.concat(PYTHON_ENTPOINT.GET_YTB_SCRIPT)
            .concat('?video_id=' + videoId)
    };


    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw new Error("Err while getting script");
    }
}

export const translateService = async (params: any, text: any) => {
    const options = {
        method: 'POST',
        url: BASE_PYTHON_URL.concat(PYTHON_ENTPOINT.TRANSLATE)
            .concat("?source=" + params.source)
            .concat("&target=", params.target),
        data: {text: text}
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw new Error("Err while translating");
    }
}

export const convertTextToSpeechService = async (data: any) => {
    const options = {
        method: 'POST',
        url: BASE_PYTHON_URL.concat(PYTHON_ENTPOINT.CONVER_TEXT_TO_SPEECH),
        data: data
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw new Error("Err while converting text to Speech");
    }
}

export const readMp3TextToSpeechService = async (audioId: any) => {
    const options = {
        method: 'GET',
        url: BASE_PYTHON_URL.concat(PYTHON_ENTPOINT.READ_MP3_SPEECH)
            .concat('?audio_id=' + audioId),
        responseType: 'arraybuffer',
    };

    try {
        // @ts-ignore
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw new Error("Err while readding mp3 text to Speech");
    }
}

export const extractTextFromImageService = async (imageUrl: any) => {
    const options = {
        method: 'POST',
        url: BASE_PYTHON_URL.concat(PYTHON_ENTPOINT.GET_TEXT_FROM_IMAGE)
            .concat('?url=' + imageUrl),
    };

    try {
        // @ts-ignore
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw new Error("Err while extracting text from image");
    }
}

