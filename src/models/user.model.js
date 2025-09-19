import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        min: 2,
        max: 20
    },
    email:{
        type: String,
        unique: true,
        match: /.+\@.+..+/,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
        require: true
    },
    profile:{
        firstName:{
            type: String,
            min:2,
            require: true,
            max:50
            
        },
        lastName:{
            type: String,
            min:2,
            require: true,
            max:50
        },
        biography:{
            type: String,
            max: 500
        },
        avatarURL:{
            type: String,
            match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i]
        },
        birthDate:{
            type: Date
        }
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updateAt:{
        type: Date
    }

})

export const userModel = model("users", userSchema);
