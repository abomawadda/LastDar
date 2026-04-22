import { Router } from "express";
import studentsRouter from "../modules/students/students.routes.js";

const apiRouter = Router();

apiRouter.use("/students", studentsRouter);

export default apiRouter;

