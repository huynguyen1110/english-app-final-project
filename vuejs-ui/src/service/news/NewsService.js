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

export const getNewsFromDbService = async (getNewsParams) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(NEWS_ENPOINT.GET_NEWS_FROM_DB)
            .concat('?page=', getNewsParams?.page)
            .concat('&size=' + getNewsParams?.size)
            .concat('&sortField=', getNewsParams?.sortField)
            .concat('&sortDirection=', getNewsParams?.sortDirection)
            .concat(getNewsParams?.topicId ? '&topicId=' + getNewsParams?.topicId : '')
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while getting news from db', error);
        throw new Error(error.response?.data || 'An error occurred while getting news from db');
    }
};

export const getNewsBySourceNameFromDbService = async (getNewsParams) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(NEWS_ENPOINT.GET_NEWS_FROM_DB_BY_SOURCE_NAME)
            .concat('?page=', getNewsParams?.page)
            .concat('&size=' + getNewsParams?.size)
            .concat('&sortField=', getNewsParams?.sortField)
            .concat('&sortDirection=', getNewsParams?.sortDirection)
            .concat('&sourceName=' + getNewsParams?.sourceName)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while getting news from db', error);
        throw new Error(error.response?.data || 'An error occurred while getting news from db');
    }
};
