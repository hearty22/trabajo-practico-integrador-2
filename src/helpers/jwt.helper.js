import jwt from "jsonwebtoken";
export const generateToken = (user , res)=>{
    try {
        const payload = ({
            id: user._id,
            username: user.username ,
            role: user.role
        })

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"1h"});

         res.cookie("token", token , {
            httpOnly: true,
            secure: false, // solo por HTTPS
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hora
        });
    } catch (error) {
        console.log(error)
        throw new Error("error on generate token");
    }
};

export const verifyToken = (req) => {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        return decoded;
    } catch (error) {
        throw new Error("error on validate token");
        
    }
}