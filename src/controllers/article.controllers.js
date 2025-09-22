import { verifyToken } from "../helpers/jwt.helper.js";
import { articleModel } from "../models/article.model.js";
import { commentModel } from "../models/comment.model.js";
import { userModel } from "../models/user.model.js";
// ● POST /api/articles → Crear artículo. (usuario autenticado)
export const createArticle = async (req, res)=>{
    try {
        //title, content, excerpt, status
        const user = await verifyToken(req);
        const {title, content, excerpt, status} = req.body;
        const article = await articleModel.create({
            title: title,
            content: content,
            excerpt: excerpt,
            status: status,
            author: user.id
        });
        await userModel.findByIdAndUpdate(user.id,{
            $push:{articles: article._id}
        });
        return res.status(201).json({
            ok: true,
            msg:"article succesfully created",
            data: article
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"internal error on creating the article"
        });
    };
};
// ● GET /api/articles → Listar artículos publicados con populate de author y tags.
export const getArticles = async (req, res)=>{
    try {
        const articles = await articleModel.find({
            status: {$eq: "published"}
        }).populate({ path :"author", select: "-articles -password -createdAt -updatedAt -__v"}).populate("tags");
        return res.status(200).json({
            ok: true,
            msg:"articles succesfully obtained",
            data: articles
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error on get the articles"
        })
    }
};
// (usuario autenticado)
// ● GET /api/articles/:id → Obtener artículo por ID con populate completo. (usuario
// autenticado)
export const getArticleById = async (req, res) => {
    try {
        const article = await articleModel.findOne({
            _id: req.params.id,
            status: {$eq : "published"}
        }).populate({ path: "author", select:"-articles -password -createdAt -updatedAt -__v"}).populate("tags");
        return res.status(200).json({
            ok: true,
            msg:"articles succesfully obtained",
            data: article
        })
    } catch (error) {
        return res.status(500).json({
            ok: true,
            msg:"internal error on get the article"
        })
    }
}
// ● GET /api/articles/my → Listar artículos del usuario logueado. (usuario autenticado)
export const getMyArticles = async (req, res)=>{
    try {
        const user = await verifyToken(req);
        const articles = await articleModel.find({
            author: user.id
        }).select("-author -__v");
        return res.status(200).json({
            ok: true,
            msg:"articles succesfully obtained",
            data: articles
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error on get the articles"
        });
    };
};
// ● PUT /api/articles/:id → Actualizar artículo (solo autor o admin).
export const updateArticle = async (req, res) => {
    try {
        // title: title,
        // content: content,
        // excerpt: excerpt,
        // status: status,
        // author: user.id
        const article = await articleModel.findById(req.params.id);
        const {title, content, excerpt, status} = req.body;
        await article.updateOne({
            title: title || article.title,
            content: content || article.content,
            excerpt: excerpt || article.excerpt,
            status: status || article.status
        });
        const updatedArticle = await articleModel.findById(req.params.id);
        return res.status(200).json({
            ok: true,
            msg:"article updated",
            data: updatedArticle
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error on updating the article"
        });
    };
}
// ● DELETE /api/articles/:id → Eliminación física (solo autor o admin).
export const deleteArticle = async (req, res) => {
    try {
        const article = await articleModel.findByIdAndDelete(req.params.id)
        const comments = await commentModel.deleteMany({
            article: article._id
        });
        return res.status(200).json({
            ok: true,
            msg:"article deleted whith their comments",
            data: {article: article,
                coments: comments.deletedCount
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg:"internal error while deleting the article"
        });
  };
};