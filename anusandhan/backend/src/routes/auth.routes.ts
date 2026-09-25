import express from "express";
import { getAllChats, startChat } from "../controllers/app.controllers.js";
import { hooker } from "../controllers/auth.controllers.js";

export const authRouter = express.Router();


authRouter.post("/hook",express.raw({
    type:"application/json"
}),hooker)
authRouter.get("/",(_req,res)=>{
    res.send("hii ")
})




