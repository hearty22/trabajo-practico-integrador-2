import { Router } from "express";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import validator from "../middlewares/validator.js";
import { createArticle, deleteArticle, getArticleById, getArticles, getMyArticles, updateArticle } from "../controllers/article.controllers.js";
import { createArticleValidator, getArticleByIdValidator, updateArticleValidator } from "../middlewares/validators/article.validators.js";
import { ownerOrAdminArticle } from "../middlewares/owner/owner.middleware.js";

const articleRouter = Router();
articleRouter.use(authenticate);
articleRouter.get("/articles/my", getMyArticles);
articleRouter.post("/articles", createArticleValidator, validator, createArticle);
articleRouter.get("/articles", getArticles);
articleRouter.get("/articles/:id", getArticleByIdValidator, validator, getArticleById);
//owner or admin
articleRouter.put("/articles/:id", ownerOrAdminArticle ,updateArticleValidator, validator, updateArticle);
articleRouter.delete("/articles/:id", ownerOrAdminArticle, getArticleByIdValidator, validator, deleteArticle);
export default articleRouter;