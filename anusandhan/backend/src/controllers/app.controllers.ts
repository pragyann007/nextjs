import type { Request, Response } from "express";
import { llmCalling, webSearch } from "../services/app.services.js"

export const getAllChats = async()=>{

}

export const startChat = async(req:Request,res:Response)=>{
    let { query ,conversationId} = req.body;

    if (typeof query !== "string") {
        return res.status(400).json({ error: "Invalid query parameter" });
    }

    if(!conversationId){
        conversationId = "0" ;
    }

    const response = await  webSearch(query);

   

    const callAi = await llmCalling(query,conversationId,response,"abc");

    

    return res.status(200).json(callAi);

}