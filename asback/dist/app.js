"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const path = require("path");
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/uploads', express_1.default.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes_1.default);
db_1.default.sync({ force: false })
    .then(() => {
    console.log("Database Syncronized successfully");
}).catch((error) => {
    console.log("Db connection unsuccessfull with error :::::;", error);
});
exports.default = app;
