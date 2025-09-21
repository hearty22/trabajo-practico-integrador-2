import { userModel } from "../models/user.model.js";

// Users (acceso admin):
// ● GET /api/users → Listar todos los usuarios con populate de artículos. (solo admin)
export const getUsers = async (req, res)=>{
    try {
        const users = await userModel.find().populate("articles");

    } catch (error) {
        
    }
};
// ● GET /api/users/:id → Obtener usuario específico con artículos y comentarios. (solo
// admin)
// ● PUT /api/users/:id → Actualizar usuario (solo admin).
// ● DELETE /api/users/:id → Eliminación física de usuario (solo admin).