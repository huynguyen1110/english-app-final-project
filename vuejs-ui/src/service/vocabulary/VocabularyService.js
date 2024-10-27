import { BASE_URL, NEWS_ENPOINT, VOCAB_ENTPOINT } from '@/enpoint';
import axios from 'axios';

export const getPackageService = async (params) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(VOCAB_ENTPOINT.GET_PACKAGE)
            .concat('?page=', params?.page)
            .concat('&size=', params?.size)
            .concat('&sortBy=', params?.sortBy)
            .concat('&direction=', params?.direction)
            .concat(params.createBy ? '&createBy=' + params?.createBy : '')
            .concat('&isPublished=', params?.isPublished)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while getting package from db', error);
        throw new Error(error.response?.data || 'An error occurred while getting package from db');
    }
};

export const createPackageService = async (packageData, userEmail) => {
    console.log(packageData)
    const options = {
        method: 'POST',
        url: BASE_URL.concat(VOCAB_ENTPOINT.CREATE_PACKAGE)
            .concat('?userEmail=' + userEmail),
        data: packageData
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while creating package', error);
        throw new Error(error.response?.data || 'An error occurred while creating package');
    }
};

export const createWordService = async (wordData) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(VOCAB_ENTPOINT.CREATE_WORD),
        data: wordData
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while creating word', error);
        throw new Error(error.response?.data || 'An error occurred while creating word');
    }
};

export const addWordToPackageService = async (wordId, packageId) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(VOCAB_ENTPOINT.ADD_WORD_TO_PACKAGE)
            .concat('?wordId=', wordId)
            .concat('&packageId=', packageId)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while adding word to package', error);
        throw new Error(error.response?.data || 'An error occurred while adding word to package');
    }
};
