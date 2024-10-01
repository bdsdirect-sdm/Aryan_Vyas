"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.userProfile = exports.userSignup = exports.userLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDetail_1 = __importDefault(require("../models/userDetail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email);
        if (!email || !password) {
            res.status(404).json({
                message: "Details is incomplete",
                success: false
            });
            return;
        }
        const user = yield userDetail_1.default.findOne({ where: {
                email: email,
            } });
        if (!user) {
            res.status(404).json({
                message: "User is not exit please Register first",
                success: false
            });
            return;
        }
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(409).json({
                success: false,
                message: "user login successfullly"
            });
        }
        const payload = {
            userId: user.id,
            email
        };
        const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECREAT_KEY, {
            expiresIn: "1h"
        });
        res.status(200).json({
            user,
            token,
            message: "token generate succesfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: error
        });
        console.log(error);
    }
});
exports.userLogin = userLogin;
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const exsistUser = yield userDetail_1.default.findOne({ where: {
                email: email
            } });
        if (exsistUser) {
            res.status(400).json({
                message: "User is already exist",
                success: false
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 6);
        console.log(hashedPassword);
        const newUser = yield userDetail_1.default.create({ firstName, lastName, email, password: hashedPassword });
        if (newUser) {
            res.status(201).json({
                success: true,
                message: "User Registered Successfullly"
            });
            return;
        }
        else {
            res.status(400).json({
                success: false,
                messagge: "problem in creating user"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "problem in creating user profile",
            success: false
        });
        console.log(error);
    }
});
exports.userSignup = userSignup;
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        // const userId=req.body.id;
        // console.log(userId)
        console.log("user Profile", user);
        return res.status(200).json({
            user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch details"
        });
    }
});
exports.userProfile = userProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { firstName, lastName, email } = req.body;
        const fetchUser = yield userDetail_1.default.findByPk(user.id);
        fetchUser.firstName = firstName;
        fetchUser.lastName = lastName;
        fetchUser.email = email;
        yield fetchUser.save();
        res.status(200).json({
            success: true,
            message: "Update value successfull"
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to update details"
        });
    }
});
exports.updateProfile = updateProfile;
