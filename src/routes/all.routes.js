import { Router } from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";

const allRouter = Router();

allRouter.use(authRouter, userRouter);


export default allRouter;