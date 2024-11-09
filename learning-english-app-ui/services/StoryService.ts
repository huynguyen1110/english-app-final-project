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