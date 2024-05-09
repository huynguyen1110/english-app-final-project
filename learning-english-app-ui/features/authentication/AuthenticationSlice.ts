import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {register} from "../../services/AuthenticationService";

interface AuthState {
    isAuthenticated: boolean;
    jwtToken: string | undefined;
    error: string | undefined;
    userInfo: any;
    registerSuccess: boolean;
}

const initialRegisterState: AuthState = {
    isAuthenticated: false,
    jwtToken: undefined,
    error: undefined,
    userInfo: null,
    registerSuccess: false
}

export const authReducer = createSlice({
    name: 'authReducer',
    initialState: initialRegisterState,
    reducers: {
        logout: (state, action) => {
            state.jwtToken = undefined;
            state.isAuthenticated = false;
            AsyncStorage.removeItem('jwt');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                state.userInfo = action.payload;
                state.jwtToken = undefined;
                state.isAuthenticated = false;
                state.registerSuccess = true;
                AsyncStorage.removeItem('jwt');
            })
            .addCase(register.rejected, (state, action) => {
                if (!action.payload) {
                    state.registerSuccess = false;
                    console.error("Register failed with error");
                }
            })
    }
})

export const { logout } = authReducer.actions;

export default authReducer.reducer;
