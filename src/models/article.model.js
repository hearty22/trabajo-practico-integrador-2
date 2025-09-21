import { Schema, model } from "mongoose";
// ● _id (ObjectId automático)
// ● title (String, 3-200 caracteres)
// ● content (String, mínimo 50 caracteres)
// ● excerpt (String, máximo 500 caracteres, opcional)
// ● status (String, enum: 'published', 'archived', default: 'published')
// ● author (ObjectId, referencia a User)
// ● tags (Array de ObjectIds, referencias a Tag - relación N:M)
// ● createdAt (Date)
// ● updatedAt (Date)

const articleSchema = new Schema({
    title:{
        type: String,
        min:2,
        max:200,
        require: true
    },
    content:{
        type: String,
        min:50,
        require: true
    },
    excerpt:{
        type: String,
        max: 500
    },
    status:{
        type: String,
        enum:["published","archived"],
        default: "published"
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    tags:[{
        type: Schema.Types.ObjectId,
        ref: "tags"
    }]
},{timestamps: true});

export const articleModel = model("articles", articleSchema);
