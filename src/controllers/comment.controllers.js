import { verifyToken } from "../helpers/jwt.helper.js";
import { commentModel } from "../models/comment.model.js";
// ● POST /api/comments → Crear comentario en artículo. (usuario autenticado)
export const createComment = async (req, res) => {
    try {
        //content, author, article
        const {content, article} = req.body;
        const user = verifyToken(req);
        const comment = await commentModel.create({
            author: user.id,
            content: content,
            article: article
        });
    
        return res.status(200).json({
            ok: false,
            msg:"comment succesfully created",
            data: comment
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error on create the comment"
        });
    }
}
// ● GET /api/comments/article/:articleId → Listar comentarios de un artículo con populate de author. (usuario autenticado)
export const getCommentsOfArticle = async (req, res) => {
    try {
        const comments = await commentModel.find({
            article: req.params.articleId
        }).populate({path: "author", select: "-password -createdAt -updatedAt -__v -articles"});
        return res.status(200).json({
            ok: false, 
            msg:"comments succesfully obtained",
            data: comments
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error on get the comments"
        });
    };
}
// ● GET /api/comments/my → Listar comentarios del usuario logueado. (usuario autenticado)
export const getMyComments = async (req, res) => {
    try {
        const user = await verifyToken(req);
        const comments = await commentModel.find({
            author: user.id
        }).populate({path: "article"}).select("-author");
        return res.status(200).json({
            ok: true,
            msg:"comments succesfully obtained",
            data: comments
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"internal error on get the comments"
        });
    }
}
// ● PUT /api/comments/:id → Actualizar comentario (solo autor o admin).
export const updateComment = async (req, res) => {
    try {
        const {content}= req.body;
        const comment = await commentModel.findById(req.params.id);
        await comment.updateOne({
            content: content || comment.content
        });
        const commentUp = await commentModel.findById(req.params.id);
        return res.status(200).json({
            ok: true,
            msg:"comment succesfully updated",
            data: commentUp
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error on update the comment"
        });
    }
}
// ● DELETE /api/comments/:id → Eliminación física de comentario (solo autor o admin).  
export const deleteComment = async (req, res) => {
    try {
        const comment = await commentModel.findByIdAndDelete(req.params.id).populate({ path: "article"        }).select("-author")
        return res.status(200).json({
            ok: true,
            msg:"comment succesfully deleted",
            data: comment
        });
    } catch (error) {
        return res.status(500).json({
            ok: false, 
            msg:"internal error on delete the comment"
        })
    }
}