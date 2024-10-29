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
    } catch (error) {
        console.error('err while getting grammar from google', error);
        throw new Error(error.response?.data || 'An error occurred while getting grammar');
    }
};

export const createGrammarService = async (grammarDto) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(GRAMMAR_ENTPOINT.CREATE_GRAMMAR),
        data: grammarDto
    };

    console.log(grammarDto)

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while creating grammar', error);
        throw new Error(error.response?.data || 'An error occurred while creating grammar');
    }
};

export const deleteGrammarService = async (id) => {
    const options = {
        method: 'PUT',
        url: BASE_URL.concat(GRAMMAR_ENTPOINT.DELETE_GRAMMAR)
            .concat('?id=', id)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while deleting grammar', error);
        throw new Error(error.response?.data || 'An error occurred while deleting grammar');
    }
};
