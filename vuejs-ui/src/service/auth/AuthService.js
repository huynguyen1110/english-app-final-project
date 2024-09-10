import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AUTHENTICATION_ENPOINT, BASE_URL } from '@/enpoint';

// validate passoword
export const passwordValidator = (value) => {
    if (!value) return 'Password is required';
    const lengthValid = value.length >= 6;
    const upperCaseValid = /[A-Z]/.test(value);
    const lowerCaseValid = /[a-z]/.test(value);
    const numberValid = /[0-9]/.test(value);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!lengthValid) return 'Password must be at least 6 characters long';
    if (!upperCaseValid) return 'Password must contain at least one uppercase letter';
    if (!lowerCaseValid) return 'Password must contain at least one lowercase letter';
    if (!numberValid) return 'Password must contain at least one number';
    if (!specialCharValid) return 'Password must contain at least one special character';

    return ''; // Return true if all conditions are met
};

export const validateRequired = (value) => {
    return value && value.trim() !== '' ? '' : 'This field is required';
};

// validate email
export const validateEmail = (value) => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(value) ? '' : 'Invalid Email Address';
};

// validate check password
export const validateCheckPassowrd = (password, checkedPassword) => {
    // Kiểm tra xem cả password và checkedPassword đều không rỗng
    if (!password || !checkedPassword) {
        return 'Password and confirm password cannot be empty';
    }

    // Kiểm tra xem password và checkedPassword có khớp nhau không
    return password === checkedPassword ? '' : 'Passwords do not match';
};

// validate phone number
export const validatePhoneNumber = (value) => {
    if (value) {
        const cleaned = value.replace(/[\s-]/g, '');

        // Kiểm tra nếu số điện thoại có 10 hoặc 11 chữ số
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

        if (phoneRegex.test(cleaned)) {
            return '';
        } else {
            return 'Invalid phone number';
        }
    } else {
        return 'Phone number is required'
    }
};

// fetch register api
export const registerService = async (registerDto) => {
    console.log(registerDto)
    const options = {
        method: 'POST',
        url: BASE_URL.concat(AUTHENTICATION_ENPOINT.REGISTER),
        data: registerDto
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while register', error);
        throw new Error(error.response?.data || 'An error occurred while registering');
    }
};

//decode token
export const decodeToken = (token) => {
    return token != null ? jwtDecode(token) : null;
};


// fetch login api
export const loginService = async (loginDto) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(AUTHENTICATION_ENPOINT.LOGIN),
        data: loginDto
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while login', error);
        throw new Error(error.response?.data || 'An error occurred while logging in');
    }
};
