import {createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, LOGIN_URI, REGISTER_URI} from "../utils/API";
import RegisterDto from "../dto/authdto/registerDto";
import LoginDto from "../dto/authdto/loginDto";
import {Alert} from "react-native";

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

            Alert.alert(
                'Thông báo',
                'Đăng ký thành công',
                [
                    {
                        text: 'Đồng ý',
                        onPress: () => {
                            // Xử lý khi người dùng nhấn nút "Đồng ý"
                            console.log('Người dùng đã đồng ý');
                        },
                    },
                ]
            );

            return data;
        } catch (err) {
            console.log(err);
            Alert.alert(
                'Thông báo',
                'Email đã được sử dụng.',
                [
                    {
                        text: 'Đồng ý',
                        onPress: () => {
                            // Xử lý khi người dùng nhấn nút "Đồng ý"
                        },
                    },
                ]
            );
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
