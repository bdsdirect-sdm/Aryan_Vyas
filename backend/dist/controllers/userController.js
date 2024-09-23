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
exports.getProfile = exports.updateProfile = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, dob, gender, phoneNumber } = req.body;
    try {
        const existingUser = yield userModel_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const newUser = yield userModel_1.default.create({
            firstName,
            lastName,
            email,
            password,
            dob,
            gender,
            phoneNumber
        });
        return res.status(201).json(newUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error signing up user' });
    }
});
exports.signup = signup;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, dob, gender, phoneNumber } = req.body;
    const userId = req.params.id;
    try {
        const existingUser = yield userModel_1.default.findOne({ where: { email, id: { $ne: userId } } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const updatedUser = yield userModel_1.default.update({
            firstName,
            lastName,
            email,
            dob,
            gender,
            phoneNumber,
        }, { where: { id: userId } });
        return res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error updating profile' });
    }
});
exports.updateProfile = updateProfile;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield userModel_1.default.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving profile' });
    }
});
exports.getProfile = getProfile;
