import { hashPassword } from "../helpers/bcrypt.helper.js";
import { commentModel } from "../models/comment.model.js";
import { userModel } from "../models/user.model.js";

// Users (acceso admin):
// ● GET /api/users → Listar todos los usuarios con populate de artículos. (solo admin)
export const getUsers = async (req, res)=>{
    try {
        const users = await userModel.findOne({
            deletedAt: null
        }).populate("articles").select("-password").select("-__v");
        return res.status(200).json({
            ok: true,
            msg:"users obtained",
            data: users
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"internal error while obtain all users"
        });
    }
};
// ● GET /api/users/:id → Obtener usuario específico con artículos y comentarios. (solo
// admin)
export const getUserById = async (req, res)=>{
    try {
        const user = await userModel.findById(req.params.id).populate("articles").select("-password").select("-__v");
        const comments = await commentModel.findOne({
            author: req.params.id
        }).select("-author").select("-__v");
        return res.status(200).json({
            ok: true,
            msg:"user, articles and comments obtained",
            data:{
                user,
                comments
            }
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error while obtain the user, articles, and comments"
        });
    };
};
// ● PUT /api/users/:id → Actualizar usuario (solo admin).
export const updateUserById = async (req, res) => {
    try {
        const {username, email, password, role } = req.body;
        const user = await userModel.findById(req.params.id);
        if(password){
            const hashPass = await hashPassword(password);
            user.updateOne({
                password: hashPass
            });
        };
        await user.updateOne({
            username: username || user.username,
            email: email || user.email,
            role: role || user.role
        })
        const userUpdated = await userModel.findById(req.params.id).select("-password").select("-__v");
        return res.status(200).json({
            ok: true,
            msg:"user updated",
            data: userUpdated
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg:"internal error while update the user"
        });
    }
}
// ● DELETE /api/users/:id → Eliminación física de usuario (solo admin).

export const deleteUserById = async (req, res)=>{
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id,{
            $currentDate:{ deletedAt: true}
        },{new: true});
        return res.status(200).json({
            ok: true,
            msg:"user deleted",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg:"internal error while deleting the user"
        });
    };
};