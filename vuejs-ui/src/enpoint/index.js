export const BASE_URL = "http://localhost:9000/api/v1";

export const AUTHENTICATION_ENPOINT = {
    REGISTER: "/user/register",
    LOGIN: "/user/login",
    UPDATE_USER: "/user/update-user",
    GET_ALL_USERS: "/user/get-all-users",
    DELETE_USER: "/user/delete-user",
};

export const NEWS_ENPOINT = {
    CREATE_NEWS: "/news/create",
    GET_NEWS: "/news/get-everything",
    GET_ARTICLE_CONTENT: '/news/get-news-content',
    GET_NEWS_FROM_DB: "/news/get-news",
    GET_NEWS_FROM_DB_BY_SOURCE_NAME: '/news/get-news-source-name',
    DELETE_NEWS: "/news/delete"
}

export const VOCAB_ENTPOINT = {
    CREATE_PACKAGE: '/package/create',
    GET_PACKAGE: "/package/get-all",
    UPDATE_PACKAGE: "/package/update",
    DELETE_PACKAGE: '/package/delete',
    CREATE_WORD: "/word/create",
    ADD_WORD_TO_PACKAGE: '/word/add-word-to-package',
    REMOVE_WORD_FROM_PACKAGE: '/word/remove-word-from-package'
}

export const THIRT_PARTY_API = {
    SERPER_DEV_API: "https://google.serper.dev"
}
