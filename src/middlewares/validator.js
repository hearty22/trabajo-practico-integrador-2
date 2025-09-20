import { validationResult } from "express-validator";

const validator = (req, res, next)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){return res.json({error: result.mapped()});
    };
    next();
};

export default validator;
