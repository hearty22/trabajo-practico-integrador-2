import mongoose from "mongoose";

export const databaseConect = async ()=>{
    try {
        mongoose.connect(process.env.DATABASE_URL);
        console.log("database succesfully connected ");
    } catch (error) {
        console.log("error while conecting the database");
        console.log(error);
    }
};
