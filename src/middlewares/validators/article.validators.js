import { body, param } from "express-validator";
import { articleModel } from "../../models/article.model.js";
//title, content, excerpt, status
export const createArticleValidator = [
    // ● title: 3-200 caracteres, obligatorio.
    body("title")
    .notEmpty().withMessage("the field must not be empty")
    .isLength({min: 3, max: 200}).withMessage("the field should have 3-200 characters")
    .isString().withMessage("the field should be a string"),
    // ● content: mínimo 50 caracteres, obligatorio.
    body("content")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field should be a astring")
    .isLength({min: 50}).withMessage("the field should be 50 characters minimum"),
    // ● excerpt: máximo 500 caracteres.
    body("excerpt")
    .optional()
    .isString().withMessage("the field should be a string")
    .isLength({max: 500}).withMessage("the field must be 500 characters maximum"),
    // ● status: solo valores permitidos ('published', 'archived').
    body("status")
    .notEmpty().withMessage("the field must not be empty")
    .isString()
    .isIn(["published", "archived"]).withMessage("the field should be a string and just published or archived")

];
export const getArticleByIdValidator = [
    param("id")
    .custom(async (value)=>{
        const article = await articleModel.findOne({
            _id: value,
            status: {$eq : "published"}
        });
        if(!article){
            throw new Error("article not found");
            
        };
    })
];
export const updateArticleValidator = [
    body("title")
    .optional()
    .isLength({min: 3, max: 200}).withMessage("the field should have 3-200 characters")
    .isString().withMessage("the field should be a string"),
    // ● content: mínimo 50 caracteres, obligatorio.
    body("content")
    .optional()
    .isString().withMessage("the field should be a astring")
    .isLength({min: 50}).withMessage("the field should be 50 characters minimum"),
    // ● excerpt: máximo 500 caracteres.
    body("excerpt")
    .optional()
    .isString().withMessage("the field should be a string")
    .isLength({max: 500}).withMessage("the field must be 500 characters maximum"),
    // ● status: solo valores permitidos ('published', 'archived').
    body("status")
    .optional()
    .isString()
    .isIn(["published", "archived"]).withMessage("the field should be a string and just published or archived"),
    param("id")
    .custom(async (value)=>{
        const article = await articleModel.findOne({
            _id: value
        });
        if(!article){
            throw new Error("article not found");
            
        };
    })

];