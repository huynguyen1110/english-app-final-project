import axios from 'axios';
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
}

export const validateRequired = (value) => {
    return value && value.trim() !== '' ? '' : 'This field is required';
}

// validate email
export const validateEmail = (value) => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(value) ? '' : 'Invalid Email Address';
};

// validate check password
export const validateCheckPassowrd = (password, checkedPassword) => {
    return checkedPassword.match(password) ? '' : 'passwords do not match';
}

// fetch register api
export const registerService = async (registerDto) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(AUTHENTICATION_ENPOINT.REGISTER),
        data: registerDto,
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while register', error);
        throw new Error(error.response?.data || 'An error occurred while registering');
    }
};

// fetch login api
export const loginService = async (loginDto) => {
    const options = {
        method: 'POST',
        url: BASE_URL.concat(AUTHENTICATION_ENPOINT.LOGIN),
        data: loginDto,
    };

    try {
        return await axios.request(options);
    } catch (error) {
        console.error('err while login', error);
        throw new Error(error.response?.data || 'An error occurred while logging in');
    }
};
