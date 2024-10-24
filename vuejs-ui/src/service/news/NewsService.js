import { BASE_URL, NEWS_ENPOINT } from '@/enpoint';
import axios from 'axios';

export const getNewsSourceService = async (params) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(NEWS_ENPOINT.GET_NEWS)
            .concat('?domains=' + params?.domain)
            .concat('&keyWord=' + params?.keyWord)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while getting news source', error);
        throw new Error(error.response?.data || 'An error occurred while getting news source data');
    }
};

export const getArticleContent = async (articleUrl) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(NEWS_ENPOINT.GET_ARTICLE_CONTENT)
            .concat('?articleUrl=' + articleUrl)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while getting article content', error);
        throw new Error(error.response?.data || 'An error occurred while getting article content');
    }
};

export const createNewsService = async (newsDto) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(NEWS_ENPOINT.CREATE_NEWS),
        data: newsDto
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while creating news', error);
        throw new Error(error.response?.data || 'An error occurred while creating news');
    }
};
