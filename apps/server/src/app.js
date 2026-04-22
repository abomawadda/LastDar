import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./core/middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      service: "dar-alquran-server",
      time: new Date().toISOString()
    });
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

