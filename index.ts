import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./src/config/database.config";
import routes from "./src/routers";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");
    // chạy một lần để reset database : await sequelize.sync({ force: true });
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Server startup error:", error.message);
    } else {
      console.error("Server startup error:", error);
    }
    process.exit(1);
  }
};

startServer();
