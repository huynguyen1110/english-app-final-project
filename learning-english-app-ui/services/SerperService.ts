import axios from "axios";
import {SERPSER_API_KEY} from "../utils/constant";
import {SERPER_DEV_API} from "../utils/API";

export const getImageResult = async (keyWord: string) => {
    const options = {
        method: 'POST',
        url: SERPER_DEV_API.concat("/images"),
        headers: {
            'X-API-KEY': SERPSER_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            "q": keyWord
        }
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error(error);
    }
}
