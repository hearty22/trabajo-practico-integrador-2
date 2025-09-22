import { Router } from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import articleRouter from "./article.routes.js";

const allRouter = Router();

allRouter.use(authRouter, userRouter, articleRouter);


export default allRouter;