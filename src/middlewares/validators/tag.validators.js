import { body, param } from "express-validator";
import { tagModel } from "../../models/tag.model.js";
import { articleModel } from "../../models/article.model.js";
export const createTagValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field must be a string")
    .isLength({min: 2, max:30}).withMessage("the field should be 2-30 characters")
    .custom(async (value) => {
        const tag = await tagModel.findOne({
            name : value
        });
        if(tag){
            throw new Error("the tag already exist");
        }
        return true;
    }),
    body("description")
    .optional()
    .isString().withMessage("the field must be a string")
    .isLength({max: 200}).withMessage("the field should be 200 characters maximum"),
    param("id")//articulo
    .custom(async (value) => {
        const article = await articleModel.findOne({
            _id: value,
            status: {$eq : "published"}
        });
        if(!article){
            throw new Error("article not found");
            
        }
    })

];

export const deletetagValidator = [
    param("id")//articulo
    .custom(async (value) => {
        const article = await articleModel.findOne({
            _id: value,
            status: {$eq : "published"}
        });
        if(!article){
            throw new Error("article not found");
            
        }
    }),
    param("tagId")
    .custom(async (value) => {
        const tag = await tagModel.findById(value);
        if(!tag){
            throw new Error("tag not found");
            
        }
    })
];