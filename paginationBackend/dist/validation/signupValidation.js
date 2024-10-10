"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignup = exports.signupValidation = void 0;
const { check, validationResult } = require("express-validator");
exports.signupValidation = [
    check("firstName")
        .notEmpty()
        .withMessage("First Name is required"),
    check("lastName")
        .notEmpty()
        .withMessage("Last Name is required"),
    check("email")
        .isEmail()
        .withMessage("A valid email is required"),
    check("password")
        .notEmpty()
        .isLength({ min: 9 })
        .withMessage("Password must be at least 8 digit long"),
];
const validateSignup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const msg = errors.array().map((el) => el.msg).join(", ");
        return res.status(400).json({ message: msg });
    }
    next();
};
exports.validateSignup = validateSignup;
