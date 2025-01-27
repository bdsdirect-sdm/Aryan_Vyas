"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePersonalSchema = exports.updateUserSchema = exports.validatePassword = exports.inviteFriendSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    first_name: joi_1.default.string().min(3).max(30).required().messages({
        'string.base': 'First name should be a type of text',
        'string.empty': 'First name is required',
        'string.min': 'First name should have a minimum length of 3',
        'string.max': 'First name should have a maximum length of 30',
    }),
    last_name: joi_1.default.string().min(3).max(30).required().messages({
        'string.base': 'Last name should be a type of text',
        'string.empty': 'Last name is required',
        'string.min': 'Last name should have a minimum length of 3',
        'string.max': 'Last name should have a maximum length of 30',
    }),
    email: joi_1.default.string()
        .email()
        .pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yopmail\.com|mailinator\.com)$/)
        .required()
        .messages({
        'string.base': 'Email should be a type of text',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'string.pattern.base': 'Email must be from Gmail or Yopmail domains',
    }),
    phone_number: joi_1.default.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.base': 'Phone number should be a type of text',
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be a valid 10-digit number',
    }),
    password: joi_1.default.string()
        .min(6)
        .max(20)
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/)
        .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of 6',
        'string.max': 'Password should have a maximum length of 20',
        'string.pattern.base': 'Password must contain at least one letter, one number, and one special character (@$!%*?&) and be between 6 to 20 characters long',
    }),
});
exports.inviteFriendSchema = joi_1.default.object({
    inviteEmail: joi_1.default.string().email().required().messages({
        'any.required': 'Invite Email is required',
        'string.email': 'Please provide a valid email address',
    }),
    inviteName: joi_1.default.string().min(3).max(50).required().messages({
        'string.min': 'Invite Name must be at least 3 characters long',
        'string.max': 'Invite Name cannot exceed 50 characters',
        'any.required': 'Invite Name is required',
    }),
    inviteMessage: joi_1.default.string().max(255).optional().messages({
        'string.max': 'Invite Message cannot exceed 255 characters',
    }),
});
const validatePassword = (data) => {
    const schema = joi_1.default.object({
        password: joi_1.default.string()
            .min(6)
            .max(20)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()"?<>|:{}(),.]).*$/)
            .message("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character")
            .required(),
        old_password: joi_1.default.string(),
    }).options({ abortEarly: false });
    return schema.validate(data);
};
exports.validatePassword = validatePassword;
// Joi schema for updating user details
exports.updateUserSchema = joi_1.default.object({
    first_name: joi_1.default.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters',
    }),
    last_name: joi_1.default.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters',
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    phone_number: joi_1.default.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
        'string.pattern.base': 'Phone number must be between 10 and 15 digits',
        'any.required': 'Phone number is required',
    }),
    ssn: joi_1.default.number()
        .integer()
        .min(10000)
        .max(999999999)
        .optional()
        .messages({
        'number.base': 'SSN must be a number',
        'number.min': 'SSN must be at least 5 digits',
        'number.max': 'SSN cannot exceed 9 digits',
    }),
    address1: joi_1.default.string()
        .max(255)
        .optional()
        .messages({
        'string.max': 'Address1 cannot exceed 255 characters',
    }),
    address2: joi_1.default.string()
        .max(255)
        .optional()
        .messages({
        'string.max': 'Address2 cannot exceed 255 characters',
    }),
    city: joi_1.default.string()
        .max(100)
        .optional()
        .messages({
        'string.max': 'City name cannot exceed 100 characters',
    }),
    state: joi_1.default.string()
        .max(100)
        .optional()
        .messages({
        'string.max': 'State name cannot exceed 100 characters',
    }),
    zip: joi_1.default.number()
        .integer()
        .min(100000)
        .max(999999)
        .optional()
        .messages({
        'number.base': 'ZIP code must be a number',
        'number.min': 'ZIP code must be 6 digits',
        'number.max': 'ZIP code cannot exceed 6 digits',
    }),
});
exports.updatePersonalSchema = joi_1.default.object({
    dob: joi_1.default.date()
        .max('now')
        .required()
        .messages({
        'date.base': 'Date of Birth must be a valid date',
        'date.max': 'Date of Birth cannot be in the future',
        'any.required': 'Date of Birth is required',
    }),
    gender: joi_1.default.string()
        .valid('Male', 'Female')
        .required()
        .messages({
        'any.only': 'Gender must be either Male or Female',
        'any.required': 'Gender is required',
    }),
    marital_status: joi_1.default.string()
        .valid('Married', 'Unmarried')
        .optional()
        .messages({
        'any.only': 'Marital status must be Single, Married, Divorced, or Widowed',
    }),
    social: joi_1.default.string()
        .optional()
        .messages({
        'string.base': 'Social must be a string',
    }),
    kids: joi_1.default.number()
        .integer()
        .min(0)
        .optional()
        .messages({
        'number.base': 'Number of kids must be a number',
        'number.min': 'Number of kids cannot be negative',
    }),
    ssn: joi_1.default.number()
        .integer()
        .min(10000)
        .max(999999999)
        .optional()
        .messages({
        'number.base': 'SSN must be a number',
        'number.min': 'SSN must be at least 5 digits',
        'number.max': 'SSN cannot exceed 9 digits',
    }),
});
