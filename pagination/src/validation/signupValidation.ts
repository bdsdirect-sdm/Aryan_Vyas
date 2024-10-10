const { check, validationResult } = require("express-validator");

export const signupValidation = [
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

export const validateSignup = (req:any, res:any, next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const msg = errors.array().map((el: { msg: any; }) => el.msg).join(", ");
        return res.status(400).json({ message: msg });
    }
    next();
};
