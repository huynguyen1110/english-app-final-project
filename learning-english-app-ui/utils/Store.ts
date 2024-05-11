import {configureStore} from '@reduxjs/toolkit';
import authReducer from "../features/authentication/AuthenticationSlice";

const store = configureStore({
    reducer: {
        authentication: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>

export default store


