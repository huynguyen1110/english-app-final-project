import {RAPID_API_HOST, RAPID_API_KEY} from "../utils/constant";
import axios from "axios";
import {CHAT_GPT_API} from "../utils/API";

export const askChatGpt = async (message: string) => {
    const options = {
        method: 'POST',
        url: CHAT_GPT_API,
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST,
            'Content-Type': 'application/json'
        },
        data: {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        }
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error(error);
    }
}
