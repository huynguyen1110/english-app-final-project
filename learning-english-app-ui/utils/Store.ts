import {configureStore} from '@reduxjs/toolkit';
import authReducer from "../features/authentication/AuthenticationSlice";
import newsReducer from "../features/home/news/NewsSlice";

const store = configureStore({
    reducer: {
        authentication: authReducer,
        newsReducer: newsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;


