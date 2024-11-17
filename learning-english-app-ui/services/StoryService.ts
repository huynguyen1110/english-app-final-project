import {BASE_URL, STORY_ENPOINT} from "../utils/API";
import axios from "axios";

export const getStoriesService = async (params: any) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(STORY_ENPOINT.GET_STORY)
            .concat("?page=", params.page || 1 )
            .concat("&size=", params?.size || 1000)
            .concat("&sortBy=", params?.sortBy)
            .concat("&direction=", params?.direction),
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error("err while getting story", error);
        throw new Error("Err while getting story");
    }
}

export const setIsReadStoryService = async (userEmail: string, storyId: any) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(STORY_ENPOINT.SET_IS_READ)
            .concat("?userEmail=", userEmail )
            .concat("&storyId=", storyId)
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error("err while setting is read story", error);
        throw new Error("Err while setting is read story");
    }
}

export const getIsReadStoryService = async (userEmail: string) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(STORY_ENPOINT.GET_IS_READ)
            .concat("?userEmail=", userEmail )
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error("err while getting is read story", error);
        throw new Error("Err while getting is read story");
    }
}