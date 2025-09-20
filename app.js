import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { databaseConect } from "./src/config/database.js";
import allRouter from "./src/routes/all.routes.js";
//importacion del index de los modelos
import "./src/models/models.js"
//definicion e inicializacion de constantes:
const PORT = process.env.SERVER_PORT || 5555;
const app = express();
//middlewares necesarios para el server
app.use(cookieParser());

app.use(express.json());
app.use(cors("*"));

//rutas para los endpoints
app.use("/api", allRouter)


app.listen(PORT, async ()=>{
    await databaseConect();
    console.log(`server listening: http://localhost:${PORT}`);
});