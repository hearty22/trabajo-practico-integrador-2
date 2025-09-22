import { param, body } from "express-validator";
import { userModel } from "../../models/user.model.js";
export const registerValidation = [
    // User/Auth:
    // ● username: 3-20 caracteres, alfanumérico, único.
    body("username")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field must be a string")
    .isAlphanumeric().withMessage("the field must be alphanumeric")
    .isLength({min: 3, max: 20}).withMessage("the field should have 3-20 characters")
    .custom(async (value)=>{
        const user = await userModel.findOne({
            username : value
        });
        if(user){
            throw new Error("the username already exist");
        }
    }),
    // ● email: formato válido, único.
    body("email")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field must be a string")
    .isEmail().withMessage("the field should be a valid email")
    .custom(async (value)=>{
        const user = await userModel.findOne({
            email : value
        });
        if(user){
            throw new Error("the email already exist");
        };
    }),
    // ● password: mínimo 8 caracteres, al menos una mayúscula, minúscula y número.
    body("password")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field must be a string")
    .isLength({min:8}).withMessage("the field should be 8 characters minimum")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("The field must contain at least one uppercase letter, one lowercase letter, and one number."),
    // ● role: solo valores permitidos ('user', 'admin').
    body("role")
    .optional()
    .isString().withMessage("the field must be a astring")
    .isIn(["user", "admin"]).withMessage("the field should be either user or admin"),
    // Profile (embebido):
    // ● firstName y lastName: 2-50 caracteres, solo letras.
    body("firstName")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field should be a string")
    .isLength({min:2, max: 50}).withMessage("the field should be 2 characters minimum and 50 maximum")
    .matches(/^[A-Za-z]+$/).withMessage("the field should contain only letters (no spaces)"),
    body("lastName")
    .notEmpty().withMessage("the field must not be empty")
    .isString().withMessage("the field should be a string")
    .isLength({min:2, max: 50}).withMessage("the field should be 2 characters minimum and 50 maximum")
    .matches(/^[A-Za-z]+$/).withMessage("the field should contain only letters (no spaces)"),
    // ● biography: máximo 500 caracteres.
    body("biography")
    .optional()
    .isString().withMessage("the field must be a string")
    .isLength({max: 500}).withMessage("the field should be 500 characters maximum"),
    // ● avatarUrl: formato URL válido (opcional).
    body("avatarURL")
    .optional()
    .isURL().withMessage("the field should be a valid URL")
];

export const updateProfileValidation = [
    body("firstName")
    .optional()
    .isString().withMessage("the field should be a string")
    .isLength({min:2, max: 50}).withMessage("the field should be 2 characters minimum and 50 maximum")
    .matches(/^[A-Za-z]+$/).withMessage("the field should contain only letters (no spaces)"),
    body("lastName")
    .optional()
    .isString().withMessage("the field should be a string")
    .isLength({min:2, max: 50}).withMessage("the field should be 2 characters minimum and 50 maximum")
    .matches(/^[A-Za-z]+$/).withMessage("the field should contain only letters (no spaces)"),
    // ● biography: máximo 500 caracteres.
    body("biography")
    .optional()
    .isString().withMessage("the field must be a string")
    .isLength({max: 500}).withMessage("the field should be 500 characters maximum"),
    // ● avatarUrl: formato URL válido (opcional).
    body("avatarURL")
    .optional()
    .isURL().withMessage("the field should be a valid URL")

];