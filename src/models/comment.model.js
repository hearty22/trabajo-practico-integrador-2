import { Schema, model } from "mongoose";
// ● _id (ObjectId automático)
// ● content (String, 5-500 caracteres)
// ● author (ObjectId, referencia a User)
// ● article (ObjectId, referencia a Article - relación 1:N)
// ● createdAt (Date)
// ● updatedAt (Date)
const commentSchema = new Schema({
    content:{
        type: String,
        min:5,
        max:500,
        require: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    article:{
        type: Schema.Types.ObjectId,
        ref: "articles"
    },

},{timestamps: true});
export const commentModel = model( "comments", commentSchema);
