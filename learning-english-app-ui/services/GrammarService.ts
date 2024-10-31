import {BASE_URL, GRAMMAR_ENTPOINT} from "../utils/API";
import axios from "axios";

export const getGrammarsService = async (params: any) => {
    const options = {
        method: 'GET',
        url: BASE_URL.concat(GRAMMAR_ENTPOINT.GET_GRAMMARS)
            .concat('?page=', params?.page)
            .concat('&size=', params?.size)
            .concat('&sortField=', params?.sortField)
            .concat('&sortDirection=', params?.sortDirection)
    };

    try {
        return await axios.request(options);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message || 'An error occurred while fetching grammars');
    }
}