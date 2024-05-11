import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, register} from "../../services/AuthenticationService";

interface AuthState {
    isAuthenticated: boolean;
    jwtToken: string | undefined;
    error: string | undefined;
    userInfo: any;
    registerSuccess: boolean;
}

const authInitialState: AuthState = {
    isAuthenticated: false,
    jwtToken: undefined,
    error: undefined,
    userInfo: null,
    registerSuccess: false
}

export const authReducer = createSlice({
    name: 'authReducer',
    initialState: authInitialState,
    reducers: {
        logout: (state: any, action) => {
            state.jwtToken = undefined;
            state.isAuthenticated = false;
            AsyncStorage.removeItem('jwt');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                if(action.payload) {
                    state.userInfo = action.payload;
                    state.jwtToken = undefined;
                    state.isAuthenticated = false;
                    state.registerSuccess = true;
                } else{
                    state.userInfo = action.payload;
                    state.jwtToken = undefined;
                    state.isAuthenticated = false;
                    state.registerSuccess = false;
                }
                AsyncStorage.removeItem('jwt');
            })
            .addCase(register.rejected, (state, action) => {
                if (!action.payload) {
                    state.registerSuccess = false;
                }
            })
            .addCase(login.fulfilled, (state, action) => {
                state.jwtToken = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.jwtToken = undefined;
                state.isAuthenticated = false;
            })
    }
})

export const {logout} = authReducer.actions;

export default authReducer.reducer;
