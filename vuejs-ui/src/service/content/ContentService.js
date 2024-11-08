import axios from 'axios';
import { BASE_URL, GRAMMAR_ENTPOINT, STORY_ENTPOINT } from '@/enpoint';

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

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while creating grammar', error);
        throw new Error(error.response?.data || 'An error occurred while creating grammar');
    }
};

export const updateGrammarService = async (grammarDto, grammarId) => {
    const options = {
        method: 'PUT',
        url: BASE_URL.concat(GRAMMAR_ENTPOINT.UPDATE_GRAMMAR)
            .concat('?id=', grammarId),
        data: grammarDto
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while updating grammar', error);
        throw new Error(error.response?.data || 'An error occurred while updating grammar');
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

export const getStoriesService = async (params) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(STORY_ENTPOINT.GET_STORIES)
            .concat('?page=', params?.page || 1)
            .concat('&size=', params?.size || 1000)
            .concat('&sortBy=', params?.sortBy)
            .concat('&direction=', params?.direction)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while getting stories', error);
        throw new Error(error.response?.data || 'An error occurred while getting stories');
    }
};

export const deleteStoryService = async (id) => {
    const options = {
        method: 'PUT',
        url: BASE_URL.concat(STORY_ENTPOINT.DELETE_STORY)
            .concat('?id=', id)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while deleting story', error);
        throw new Error(error.response?.data || 'An error occurred while deleting story');
    }
};


