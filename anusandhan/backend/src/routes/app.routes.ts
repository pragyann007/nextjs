import express from "express";
import { getAllChats, startChat } from "../controllers/app.controllers.js";
import { isAuth } from "../middleware/auth.middleware.js";

export const appRouter = express.Router();


appRouter.get("/chats",isAuth,getAllChats)
appRouter.post("/chat/start",isAuth,startChat);