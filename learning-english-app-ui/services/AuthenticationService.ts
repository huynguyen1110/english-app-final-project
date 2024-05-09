import {createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, REGISTER_URI} from "../utils/API";

interface RegisterDto {
    email: string;
    password: string;
    phoneNumber: string;
}

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
