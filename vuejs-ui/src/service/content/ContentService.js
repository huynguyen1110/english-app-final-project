import axios from 'axios';
import { BASE_URL, GRAMMAR_ENTPOINT } from '@/enpoint';

export const getGrammarsService = async (params) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(GRAMMAR_ENTPOINT.GET_GRAMMARS)
            .concat('?page=', params?.page || 1)
            .concat('&size=', params?.size || 1000)
            .concat('&sortField=', params?.sortField)
            .concat('&sortDirection=', params?.sortDirection)
    };

    try {
        return await axios.request(options);
        // images[index].thumbnailUrl
    } catch (error) {
        console.error('err while getting images from google', error);
        throw new Error(error.response?.data || 'An error occurred while getting user');
    }
};
