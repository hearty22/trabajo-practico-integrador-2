import { Schema, model } from "mongoose";
// ● _id (ObjectId automático)
// ● name (String, único, 2-30 caracteres, sin espacios)
// ● description (String, opcional, máximo 200 caracteres)
// ● createdAt (Date)
// ● updatedAt (Date)
const tagSchema = new Schema({
    _id:{
        type: String
    },
    name:{
        type: String,
        unique: true,
        min:2,
        max:30,
        trim: true
    },
    description:{
        type: String,
        max: 200
    }
},{timestamps: true});

export const tagModel = model("tags", tagSchema);