"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/", routes_1.default);
// Serve static files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../", "uploads"), {
    setHeaders: (res) => {
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
}));
// Default route
app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript!");
});
// Database connection and server start
const PORT = process.env.PORT || 8000;
db_1.default
    .sync({ alter: false })
    .then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Unable to connect to the database:", error);
});
