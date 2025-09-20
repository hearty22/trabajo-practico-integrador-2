import { Router } from "express";
import authRouter from "./auth.routes.js";

const allRouter = Router();

allRouter.use(authRouter);


export default allRouter;