import {createAsyncThunk} from "@reduxjs/toolkit";
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return data;
        } catch (err: any) {
            console.log(err)
            return null;
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
                throw new Error('Login failed account is not exested');
            }

            return await response.json();
        } catch (err) {
            console.log(err);
            return null;
        }
    }
)

export const addToken = createAsyncThunk(
    'addToken',
    async (token: string) => {
        await AsyncStorage.removeItem('jwt');
        await AsyncStorage.setItem('jwt', token);
    }
)
