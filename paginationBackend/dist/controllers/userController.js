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
exports.updateUser = exports.getUserById = exports.getUsers = exports.addUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Address_1 = __importDefault(require("../models/Address"));
const welcomeEmailTemplate_1 = __importDefault(require("../emailTemplates/welcomeEmailTemplate"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const files = Object.assign({}, req === null || req === void 0 ? void 0 : req.files);
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            appointmentLetter: (_b = (_a = files === null || files === void 0 ? void 0 : files.appointmentLetter) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename,
            profilePhoto: (_d = (_c = files === null || files === void 0 ? void 0 : files.profilePhoto) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename,
        };
        //
        const exsistUser = yield User_1.default.findOne({ where: {
                email: userData.email
            } });
        if (exsistUser) {
            res.status(400).json({
                message: "User is already exist",
                success: false
            });
            return;
        }
        //
        const user = yield User_1.default.create(userData);
        const addressData = {
            userId: user.id,
            companyAddress: req.body.companyAddress,
            companyCity: req.body.companyCity,
            companyState: req.body.companyState,
            companyZip: req.body.companyZip,
            homeAddress: req.body.homeAddress,
            homeCity: req.body.homeCity,
            homeState: req.body.homeState,
            homeZip: req.body.homeZip,
        };
        yield Address_1.default.create(addressData);
        //
        const mailOptions = {
            from: "vyasaryan786@gmail.com",
            to: userData.email,
            subject: "Hello! Welcome To Our Family",
            html: (0, welcomeEmailTemplate_1.default)(userData.firstName, userData.lastName),
        };
        mailer_1.default.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error occurred:' + error.message);
            }
            console.log('Message sent: %s', info.messageId);
        });
        //
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
exports.addUser = addUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.findAll({ include: Address_1.default });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findByPk((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id, { include: Address_1.default });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield User_1.default.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const updatedUserData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            profilePhoto: req.file ? req.file.path : user.profilePhoto,
            appointmentLetter: req.body.appointmentLetter,
        };
        yield User_1.default.update(updatedUserData, { where: { id: userId } });
        const addressData = {
            companyAddress: req.body.companyAddress,
            companyCity: req.body.companyCity,
            companyState: req.body.companyState,
            companyZip: req.body.companyZip,
            homeAddress: req.body.homeAddress,
            homeCity: req.body.homeCity,
            homeState: req.body.homeState,
            homeZip: req.body.homeZip,
        };
        yield Address_1.default.update(addressData, { where: { userId } });
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
// export const deleteUser = async (req: Request, res: any) => {
//   const userId = req.params.id;
//   try {
//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     await Address.destroy({ where: { userId } });
//     await User.destroy({ where: { id: userId } });
//     res.status(204).send(); 
//   } catch (error:any) {
//     res.status(500).json({ message: error.message });
//   }
// };
