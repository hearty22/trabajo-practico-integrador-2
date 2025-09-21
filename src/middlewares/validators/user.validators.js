import { body, param } from "express-validator";
import { userModel } from "../../models/user.model.js";

export const getUsersByIdValidator = [
    param("id")
    .custom(async (value) => {
        const user = await userModel.findOne({
            _id: value,
            deletedAt: {$eq: null}
        });
        if(!user){
            throw new Error("user not found");
        }
        return true;
    })
];
export const updateUserByIdValidator = [
    body("username")
    .optional()
    .isString().withMessage("the field must be a string")
    .isAlphanumeric().withMessage("the field must be alphanumeric")
    .isLength({min: 3, max: 20}).withMessage("the field should be 3-20 characters")
    .custom(async (value, {req})=>{
        const user = await userModel.findOne({
            username : value,
            _id: {$ne: req.params.id},
            deletedAt: {$eq: null}
        });
        if(user){
            throw new Error("the username already exist");
        }
    }),
    // ● email: formato válido, único.
    body("email")
    .optional()
    .isString().withMessage("the field must be a string")
    .isEmail().withMessage("the field should be a valid email")
    .custom(async (value, {req})=>{
        const user = await userModel.findOne({
            email : value,
            _id: {$ne : req.params.id},
            deletedAt: {$eq: null}
        });
        if(user){
            throw new Error("the email already exist");
        };
    }),
    // ● password: mínimo 8 caracteres, al menos una mayúscula, minúscula y número.
    body("password")
    .optional()
    .isString().withMessage("the field must be a string")
    .isLength({min:8}).withMessage("the field should be 8 characters minimum")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("The field must contain at least one uppercase letter, one lowercase letter, and one number."),
    // ● role: solo valores permitidos ('user', 'admin').
    body("role")
    .optional()
    .isString().withMessage("the field must be a astring")
    .isIn(["user", "admin"]).withMessage("the field should be either user or admin"),
    param("id")
    .custom(async (value) => {
        const user = await userModel.findOne({
            _id: value,
            deletedAt: {$eq: null}
        });
        if(!user){
            throw new Error("user not found");
        }
        return true;
    })
];

export const deleteUserByIdValidation = [
    param("id")
    .custom(async (value)=>{
        const user = await userModel.findOne({
            _id: value,
            deletedAt: {$eq: null}
        });
        if(!user){
            throw new Error("user not found");
        };
        return true;
    })

];