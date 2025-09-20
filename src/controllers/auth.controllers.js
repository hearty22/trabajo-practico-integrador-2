import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";
import { generateToken, verifyToken } from "../helpers/jwt.helper.js";
import { userModel } from "../models/user.model.js";
// ● POST /api/auth/register: Registro de usuario con perfil embebido. (público)
export const register = async (req, res)=>{
    try {
        //atributes:
        // username, email, password, role, profile:{firstName, lastName, biography, avatarURL, birthDate}, createdAt, updatedAt
        const {username, email, password, role, firstName, lastName, biography, avatarURL, birthDate} = req.body;
        const hashPass = await hashPassword(password);
        const newUser = await userModel.create({
            username: username,
            email: email,
            password: hashPass,
            role: role,
            profile:{
                firstName: firstName,
                lastName: lastName,
                biography: biography,
                avatarURL: avatarURL,
                birthDate: birthDate
            }
        });
        return res.status(201).json({
            ok: true,
            msg: "user succesfully created",
            data: newUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "internal error while create user"
        })
    }
};
// ● POST /api/auth/login: Login con JWT enviado como cookie segura. (público)
export const login = async (req, res)=>{
    try {
        const {username, password} = req.body;
        const user = await userModel.findOne({
            username: username
        });
        if(!user){
            return res.status(401).json({
                ok: false,
                msg:"invalid credentials: username"
            });
        };
        const matchPass = await comparePassword(password, user.password);
        if(!matchPass){
            return res.status(401).json({
                ok: false,
                msg:"invalid credentials: password"
            });
        };
        generateToken(user, res);
        return res.status(200).json({
            ok: true,
            msg:"user logged"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:"internal error while the login"
        })
    }
};
// ● GET /api/auth/profile: Obtener perfil del usuario autenticado. (usuario autenticado)
export const getProfile = async (req, res)=>{
    try {
        const token = verifyToken(req);
        const user = await userModel.findById(token.id);
        const profile = user.profile;
        return res.status(200).json({
            ok: true,
            msg:"profile succesfully obtain",
            data: profile
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"internal error while getting the profile"
        });
    }
};
// ● PUT /api/auth/profile: Actualizar perfil embebido del usuario autenticado. (usuario
// autenticado)
export const updateProfile = async (req, res) => {
    try {
        const {firstName, lastName, biography, avatarURL, birthDate} = req.body;
        const token = verifyToken(req);
        const user = await userModel.findByIdAndUpdate(token.id,{
            $currentDate: {updatedAt: true}
        });
        await user.updateOne({
            profile:{
                firstName: firstName || user.profile.firstName,
                lastName: lastName || user.profile.lastName,
                biography: biography || user.profile.biography,
                avatarURL: avatarURL || user.profile.avatarURL,
                birthDate: birthDate || user.profile.birthDate
            }
        });

        const userUpdated = await userModel.findById(token.id);
        return res.status(200).json({
            ok: true,
            msg:"profile succesfully updated",
            data: userUpdated.profile
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:"internal error while updating the profile"
        });
    };
};
// ● POST /api/auth/logout: Logout limpiando cookie de autenticación. (usuario
// autenticado)
export const logout = async (req, res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({
            ok: true,
            msg:"session closed succesfully"
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error while logging out"
        });
    };
};