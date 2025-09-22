import { Router } from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import articleRouter from "./article.routes.js";
import commentRouter from "./comment.routes.js";
import tagsRouter from "./tag.routes.js";

const allRouter = Router();

allRouter.use(authRouter, userRouter, articleRouter, commentRouter, tagsRouter);


export default allRouter;