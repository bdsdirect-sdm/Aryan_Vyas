"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = (0, express_1.Router)();
router.post('/users', upload_1.default.fields([{ name: 'profilePhoto' }, { name: 'appointmentLetter' }]), userController_1.addUser);
router.get('/users', userController_1.getUsers);
router.get('/users/:id', userController_1.getUserById);
router.put('/users/:id', upload_1.default.fields([{ name: 'profilePhoto' }, { name: 'appointmentLetter' }]), userController_1.updateUser);
exports.default = router;
