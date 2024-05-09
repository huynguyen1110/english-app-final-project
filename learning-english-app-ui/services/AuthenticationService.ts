import {createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, LOGIN_URI, REGISTER_URI} from "../utils/API";
import RegisterDto from "../dto/authdto/registerDto";
import LoginDto from "../dto/authdto/loginDto";

export const register = createAsyncThunk(
    'user/register', // action name
    async (registerDto: RegisterDto, {rejectedWithValue}: any) => {
        try {
            const response = await fetch(BASE_URL.concat(REGISTER_URI), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerDto)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // await AsyncStorage.setItem('jwt', data);
            return data;
        } catch (err) {
            return rejectedWithValue(err);
        }
    }
)

export const login = createAsyncThunk(
    'user/login', // action name
    async (loginDto: LoginDto, {rejectedWithValue}: any) => {
        try {
            const response = await fetch(BASE_URL.concat(LOGIN_URI), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDto)
            });

            if (!response.ok) {
                throw new Error('login failed with error');
            }

            const data = await response.json();
            addToken(data);
            return data;
        } catch (err) {
            return rejectedWithValue(err);
        }
    }
)

export const addToken = createAsyncThunk(
    'addToken',
    async (token: string) => {
        await AsyncStorage.setItem('jwt', token);
    }
)
