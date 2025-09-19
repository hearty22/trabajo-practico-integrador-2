import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
//importacion del index de los modelos

//definicion e inicializacion de constantes:

const PORT = process.env.SERVER_PORT || 5555;
const app = express();

//middlewares necesarios para el server

app.use(express.json());
app.use(cookieParser());
app.use(cors({

}));


app.listen(PORT, async ()=>{
    console.log(`server listening: http://localhost:${PORT}`);
})