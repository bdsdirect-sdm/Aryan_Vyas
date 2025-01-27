import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db";
import router from "./routes/routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", router);

// Serve static files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../", "uploads"), {
    setHeaders: (res) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Aryan Vyas Welcome To Express With Typescript!");
});

// Database connection and server start
const PORT = process.env.PORT || 8000;

sequelize
  .sync({ alter: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Unable to connect to the database:", error);
  });
