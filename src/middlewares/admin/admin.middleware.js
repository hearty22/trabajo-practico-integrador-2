import { verifyToken } from "../../helpers/jwt.helper.js";

export const admin = async (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){return res.status(401).json({ok: false, msg:"no token provided"});};
    const decoded = verifyToken(req);
    if(decoded.role != "admin"){
        return res.status(403).json({
            ok: false,
            msg:"acces denied: no admin"
        });
    };
    next();
};