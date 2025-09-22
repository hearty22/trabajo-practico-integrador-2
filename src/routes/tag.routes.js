import { Router } from "express";
import { ownerOrAdminArticle } from "../middlewares/owner/owner.middleware.js";
import { createTagValidator, deletetagValidator } from "../middlewares/validators/tag.validators.js";
import validator from "../middlewares/validator.js";
import { createTag, deletetag } from "../controllers/tag.controllers.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";

const tagsRouter = Router();
tagsRouter.use(authenticate)
tagsRouter.post("/articles/:id/tags/:tagId", ownerOrAdminArticle, createTagValidator, validator ,createTag);
tagsRouter.delete("/articles/:id/tags/:tagId", ownerOrAdminArticle, deletetagValidator, validator, deletetag);

export default tagsRouter;