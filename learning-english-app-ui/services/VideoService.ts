import {YTB_API} from "../utils/API";
import {RAPID_API_KEY, RAPID_API_YTB_HOST} from "../utils/constant";
import axios from "axios";

export const getYtbVideosService = async (params: any) => {
    const options = {
        method: 'POST',
        url: YTB_API.concat("/search")
            .concat('?query=', params?.query)
            .concat('&type=', params?.videos)
            .concat('&duration=', params?.duration),
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_YTB_HOST,
        },
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
    }
}