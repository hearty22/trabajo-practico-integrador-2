import { body, param } from "express-validator";
import { articleModel } from "../../models/article.model.js";
import { commentModel } from "../../models/comment.model.js";

export const createCommentValidator = [
    // ● content: 5-500 caracteres, obligatorio.
    body("content")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field must be a string")
    .isLength({min: 5, max: 500}).withMessage("the field should be 5-500 characters"),
    // ● author: ObjectId válido.
    // ● article: ObjectId válido que debe existir.
    body("article")
    .custom(async (value) => {
        const article = await articleModel.findOne({
            _id: value,
            status: {$eq : "published"}
        });
        if(!article){
            throw new Error("article not found");
        }
        return true;
    })
];
export const getCommentsOfArticleValidator = [
    param("articleId")
    .custom(async (value)=>{
        const article = await articleModel.findById(value)
        if(!article){
            throw new Error("article not found");
            
        }
        return true;
    })
];
export const updateCommentValidator = [
    param("id")
    .custom(async (value) => {
        const comment = await commentModel.findById(value);
        if(!comment){
            throw new Error("comment not found");
        }
    }),
    body("content")
    .optional()
    .isString().withMessage("the field must be a string")
    .isLength({min: 5, max: 500}).withMessage("the field should be 5-500 characters"),
];
export const deleteCommentvalidator = [
    param("id")
    .custom(async (value) => {
        const comment = await commentModel.findById(value);
        if(!comment){
            throw new Error("comment not found");
        }
    })
];