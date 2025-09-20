import { Schema, model } from "mongoose";
// ● _id (ObjectId automático)
// ● name (String, único, 2-30 caracteres, sin espacios)
// ● description (String, opcional, máximo 200 caracteres)
// ● createdAt (Date)
// ● updatedAt (Date)
const tagSchema = new Schema({
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
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    }
});

export const tagModel = model("tags", tagSchema);