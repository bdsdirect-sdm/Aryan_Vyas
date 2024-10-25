"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const retailer_1 = __importDefault(require("./routes/retailer"));
const product_1 = __importDefault(require("./routes/product"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/retailers', retailer_1.default);
app.use('/api/products', product_1.default);
db_1.default.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});
exports.default = app;
