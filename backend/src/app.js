import express from "express"
import dotenv from "dotenv"
import aiRouter from "./routes/ai.routes.js";
import cors from "cors"
dotenv.config();
const server=express();
server.use(express.json());
server.use(express.static("./public"))
server.use(cors())
server.use("/api/ai",aiRouter);
export default server;