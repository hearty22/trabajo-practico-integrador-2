import { Router } from "express";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { createCommentValidator, deleteCommentvalidator, getCommentsOfArticleValidator, updateCommentValidator } from "../middlewares/validators/comment.validators.js";
import validator from "../middlewares/validator.js";
import { createComment, deleteComment, getCommentsOfArticle, getMyComments, updateComment } from "../controllers/comment.controllers.js";
import { ownerOrAdminComment } from "../middlewares/owner/owner.middleware.js";
const commentRouter = Router();
commentRouter.use(authenticate)
commentRouter.post("/comments", createCommentValidator, validator, createComment);
commentRouter.get("/comments/my", getMyComments);
commentRouter.get("/comments/article/:articleId", getCommentsOfArticleValidator, validator, getCommentsOfArticle);
commentRouter.put("/comments/:id", ownerOrAdminComment , updateCommentValidator, validator, updateComment);
commentRouter.delete("/comments/:id", ownerOrAdminComment, deleteCommentvalidator, deleteComment);

export default commentRouter;