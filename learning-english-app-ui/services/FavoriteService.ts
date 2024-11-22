import axios from "axios";
import {BASE_URL, FAVORITE_ENPOINT} from "../utils/API";

export const addNewsToFavoriteService = async (userEmail: string | null | undefined, newsId: number | null | undefined) => {
    if (!userEmail) {
        throw new Error("User email cannot be null or undefined.");
    }
    if (newsId == null) {
        throw new Error("News ID cannot be null or undefined.");
    }

    const options = {
        method: 'POST',
        url: BASE_URL.concat(FAVORITE_ENPOINT.ADD_FAVORITE_NEWS)
            .concat("?userEmail=" + userEmail)
            .concat("&newsId=" + newsId),
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getFavoriteNewsService = async (params: any) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(FAVORITE_ENPOINT.GET_FAVORITE_NEWS)
            .concat("?page=" + params?.page)
            .concat("&size=" + params?.size)
            .concat("&sortField=" + params.sortField)
            .concat("&sortDirection=" + params.sortDirection)
            .concat("&userEmail=" + params.userEmail),
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

