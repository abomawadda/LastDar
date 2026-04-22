import { Router } from "express";
import { listStudents } from "./students.controller.js";

const studentsRouter = Router();

studentsRouter.get("/", listStudents);

export default studentsRouter;

