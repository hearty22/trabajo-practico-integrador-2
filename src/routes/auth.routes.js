import { Router } from "express";
import { getProfile, login, logout, register, updateProfile } from "../controllers/auth.controllers.js";
import { registerValidation, updateProfileValidation } from "../middlewares/validators/auth.validators.js";
import validator from "../middlewares/validator.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
const authRouter = Router();


authRouter.post("/auth/register", registerValidation, validator, register);
authRouter.post("/auth/login", login);
authRouter.get("/auth/profile", authenticate, getProfile);
authRouter.put("/auth/profile", authenticate, updateProfileValidation, validator, updateProfile);
authRouter.post("/auth/logout", authenticate, logout);
export default authRouter;