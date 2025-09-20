import { verifyToken } from "../../helpers/jwt.helper.js";

export const authenticate = async (req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                ok: false,
                msg:"no token provided"
            });
        };
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok: true,
            msg:"invalid token"
        })
    }
};