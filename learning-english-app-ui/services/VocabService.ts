import axios from "axios";
import {BASE_URL, PACAKGE_ENPOINT, WORD_ENPOINT} from "../utils/API";
import {decodeJwtToken} from "./AuthenticationService";

// create package service
export const createPackageService = async (packageDto: any) => {
    const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIdXk2OTY4MEBnbWFpbC5jb20iLCJyb2xlIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE3MjM0NzgyNjAsImV4cCI6MTcyMzUxNDI2MH0.R5jR28VDxncQ5Xi99CH6vK--mMQAO5zBLhhREYOaXBU";
    // const token = getJwtToken();
    const decodedToken = decodeJwtToken(testToken);
    const options = {
        method: 'POST',
        url: BASE_URL.concat(PACAKGE_ENPOINT.CREATE_PACKAGE.concat("?userEmail=" + decodedToken?.sub)),
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            name: packageDto.name,
            description: packageDto.description,
            isPublished: packageDto.isPublished,
        }
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error(error);
    }
}

// get package service
export const getPackageService = async (params: any) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(PACAKGE_ENPOINT.GET_PACKAGES)
            .concat("?page=" + params.page)
            .concat("&size=" + params.size)
            .concat("&sortBy=" + params.sortBy)
            .concat("&direction=" + params.direction)
            .concat("&createBy=" + params.createBy),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
    }
}

// create word service
export const createWord = async (wordDto: any) => {

    const options = {
        method: 'POST',
        url: BASE_URL.concat(WORD_ENPOINT.CREATE_WORD),
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            name: wordDto.name,
            description: wordDto.description,
            meaning: wordDto.meaning,
            example: wordDto.example,
            wordType: wordDto.wordType,
            image: wordDto.image,
            audio: wordDto?.audio,
            phonetic: wordDto?.phonetic
        }
    };

    try {
        return await axios.request(options);
    } catch (error: any) {
        console.error("err while creating word",  error.response);
    }
}

// add word to package
export const addWordToPackage = async (wordId: any, packageId: any) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(WORD_ENPOINT.ADD_WORD_TO_PACKAGE)
            .concat("?wordId=" + wordId)
            .concat("&packageId=" + packageId),
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
    }
}
