import axios from "axios";
import {SERPSER_API_KEY} from "../utils/constant";

export const getImageResult = async (keyWord: string) => {
    const options = {
        method: 'POST',
        url: 'https://google.serper.dev/images',
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
