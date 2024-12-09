"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkToken = (token) => {
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.SECREAT_KEY);
        if (!decode) {
            return null;
        }
        else {
            return decode;
        }
    }
    catch (error) {
        return null;
    }
};
exports.checkToken = checkToken;