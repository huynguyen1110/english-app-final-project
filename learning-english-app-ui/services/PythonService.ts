import {BASE_PYTHON_URL, PYTHON_ENTPOINT} from "../utils/API";
import axios from "axios";

export const getYtbVideoScriptService = async (videoId: string) => {
    const options = {
        method: 'GET',
        url: BASE_PYTHON_URL.concat(PYTHON_ENTPOINT.GET_YTB_SCRIPT)
            .concat('?video_id=' + videoId)
    };

    console.log(options);

    try {
        return await axios.request(options);
    } catch (error) {
        console.error(error);
        throw new Error("Err while getting script");
    }
}
