export const BASE_URL = 'http://192.168.133.173:9000';

// authentication
export const REGISTER_URI = '/api/v1/user/register';
export const LOGIN_URI = '/api/v1/user/login';

// news
export const GET_NEWS_FROM_DB = "/api/v1/news/get-news";
export const GET_NEWS_BY_ID = "/api/v1/news/get-news-id";
export const GET_NEWS_BY_SOURCE_NAME = "/api/v1/news/get-news-source-name";

// dictionary api
export const ENGLISH_DIC_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

// translation api
export const TRANSLATION_API = "https://script.google.com/macros/s/AKfycbzEji5bqs0jJ9JJsDkMvYKEItUAV24WHHy0b_4NzWykOlLKrZp9YRB7mSKLNxIMTxtqig/exec";

// chat gpt api
export const CHAT_GPT_API = "https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions";

// api to search result from google
export const SERPER_DEV_API = "https://google.serper.dev";

export const PACAKGE_ENPOINT = {
    CREATE_PACKAGE: "/api/v1/package/create",
    GET_PACKAGES: "/api/v1/package/get-all",
    DELETE_PACKAGE: "/api/v1/package/delete",
}

export const WORD_ENPOINT = {
    CREATE_WORD: "/api/v1/word/create",
    ADD_WORD_TO_PACKAGE: "/api/v1/word/add-word-to-package",
    REMOVE_WORD_FROM_PACKAGE: "/api/v1/word/remove-word-from-package",
}

export const FAVORITE_ENPOINT = {
    ADD_FAVORITE_NEWS: "/api/v1/favorite/add-news",
    GET_FAVORITE_NEWS: "/api/v1/favorite/get-news",
}

export const FILE_ENPOINT = {
    UPLOAD_IMAGE: "/api/v1/files/upload/image",
}
