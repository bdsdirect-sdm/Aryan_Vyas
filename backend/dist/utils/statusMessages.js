"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDetailsMessage = exports.LoginMessage = exports.signupMessage = void 0;
exports.signupMessage = {
    success: {
        userCreated: 'User registered successfully!',
        adminCreated: "Admin successfully registered.",
    },
    error: {
        missingFields: 'All fields are required.',
        emailTaken: 'Invalid Email',
        serverError: 'An error occurred during signup.',
    },
};
exports.LoginMessage = {
    success: {
        loginSuccess: 'Login successful',
    },
    error: {
        missingFields: 'Please provide both email and password',
        invalidCredentials: 'Invalid Crenditals',
        serverError: 'Internal server error',
    },
};
exports.userDetailsMessage = {
    success: {
        message: 'Data fetched Successfully',
    },
    error: {
        serverError: 'Internal server error',
        notfound: "User Details Not Found"
    },
};
