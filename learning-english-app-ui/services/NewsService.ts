import {createAsyncThunk} from "@reduxjs/toolkit";
import {BASE_URL, GET_NEWS_BY_ID, GET_NEWS_BY_SOURCE_NAME, GET_NEWS_FROM_DB, WORD_ENPOINT} from "../utils/API";
import GetNewsParams from "../dto/news/GetNewsParams";
import axios from "axios";

export const getNewsFromDb = createAsyncThunk(
    'news/get-news', // action name
    async (getNewsParams: GetNewsParams, {rejectedWithValue}: any) => {
        try {
            const response = await fetch(BASE_URL.concat(GET_NEWS_FROM_DB + "?page=" + getNewsParams.page + "&size=" + getNewsParams.size
            + "&sortField=" + getNewsParams.sortField + "&sortDirection=" + getNewsParams.sortDirection +"&topicId=" + getNewsParams.topicId), {
                method: 'GET'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return data;
        } catch (err: any) {
            console.log(err)
            return null;
        }
    }
)

export const getNewsById = createAsyncThunk(
    'news/get-news-id', // action name
    async (newsId: number, {rejectedWithValue}: any) => {
        try {

            const response = await fetch(BASE_URL.concat(GET_NEWS_BY_ID + "?newsId=" + newsId), {
                method: 'GET'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return data;
        } catch (err: any) {
            console.log(err)
            return null;
        }
    }
)

// get news by source name service
export const getNewsBySourceNameService = async (params: any) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(GET_NEWS_BY_SOURCE_NAME)
            .concat("?page=" + params.page)
            .concat("&size=" + params.size)
            .concat("&sortField=" + params.sortField)
            .concat("&sortDirection=" + params.sortDirection)
            .concat("&sourceName=" + params.sourceName),
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
