import { articleModel } from "../models/article.model.js";
import { tagModel } from "../models/tag.model.js";

// ● POST /api/articles/:articleId/tags/:tagId → Agregar etiqueta a artículo. (solo autor
// o admin)
export const createTag = async (req, res) => {
    try {
        // ● name: 2-30 caracteres, único, obligatorio, sin espacios.
        // ● description: máximo 200 caracteres.
        const {name, description}=req.body;
        const {tagId}=req.params;
        const tag = await tagModel.create({
            _id: tagId,
            name: name,
            description: description
        });
        const article = await articleModel.findByIdAndUpdate(req.params.id,{
            $push:{ tags : tag._id}
        },{new: true}).populate("tags");
        return res.status(201).json({
            ok: true,
            msg:"tag created",
            data: {tag: tag,
                article: article
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg:"internal error while creating the tag"
        })
    }
}
// ● DELETE /api/articles/:articleId/tags/:tagId → Remover etiqueta de artículo. (solo
// autor o admin)
export const deletetag = async (req, res) => {
    try {
        const article = await articleModel.findById(req.params.id);
        const {tagId} = req.params;
        const tag = await tagModel.findByIdAndDelete(req.params.tagId);
        await article.updateOne({
            $pull : {tags : tagId }
        });
        return res.status(200).json({
            ok: true,
            msg:"tag sucessfully deleted",
            data: tag
        })
    } catch (error) {
        return res.status(500).json({
            ok: false, 
            msg:"internal error on delete the tag",
            error: error
        });
    }
}