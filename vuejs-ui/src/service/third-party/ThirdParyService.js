import axios from 'axios';
import { THIRT_PARTY_API } from '@/enpoint';
import { THIR_PARTY_SERVICE_KEY } from '@/Constaints/Constaints';

export const getImageFromGoogleService = async (keyWord) => {
    const options = {
        method: 'POST',
        url: THIRT_PARTY_API.SERPER_DEV_API.concat("/images"),
        headers: {
            'X-API-KEY': THIR_PARTY_SERVICE_KEY.SERPSER_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            "q": keyWord
        }
    };

    try {
        return await axios.request(options);
        // images[index].thumbnailUrl
    } catch (error) {
        console.error("err while getting images from google" ,error);
        throw new Error(error.response?.data || 'An error occurred while getting user');
    }
}
