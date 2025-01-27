"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); // Set the folder for uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/; // Allowed file types
    const extName = allowedFileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images are allowed (jpeg, jpg, png)."));
    }
};
// Limit file size to 2MB
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});
exports.default = upload;
