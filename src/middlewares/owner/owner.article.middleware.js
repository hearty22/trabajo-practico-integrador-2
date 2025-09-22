import { verifyToken } from "../../helpers/jwt.helper.js";
import { articleModel } from "../../models/article.model.js";

export const ownerOrAdminArticle = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){return res.status(401).json({ok: false, msg:"no token provided"});};
        const decoded = verifyToken(req);
        if(decoded.role != "admin"){
            const article = await articleModel.findById(req.params.id);
            if(!article){return res.status(404).jon({ok: false, msg:"article not found"})}
            if(toString(article.author)== decoded.id){
                next();
            };
            return res.status(403).json({ok: false, msg:"acces denied: no owner"})
        };
        next();
    } catch (error) {
        return res.status(500).json({
            ok: false, 
            msg:"internal error on validate the article owner"
        });
    };
};