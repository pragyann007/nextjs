import type { Request, Response } from "express";
import { prisma } from "../lib/client.js";
import { createUser } from "../repiository/app.repiository.js";
import type { Provider } from "../generated/prisma/enums.js";
import {Webhook} from "svix"

export interface IUser {
    supabaseId: string,
    userName: string,
    email: string,
    provider: Provider

}
const secret = process.env.SUPABASE_WEBHOOK_SECRET! ;
export const hooker = async (req: Request, res: Response) => {
   try {
    let secretPayload: string = secret.split(",")[1] ?? "";

     const wh = new Webhook(secretPayload)
     const payload = req.body
 
     const event  = wh.verify(payload,{
         "webhook-id": req.headers["webhook-id"] as string,
         "webhook-timestamp": req.headers["webhook-timestamp"] as string,
         "webhook-signature": req.headers["webhook-signature"] as string,
     })
 
     console.log("✅ WEBHOOK VERIFIED");
     console.log(event);


     const {
        metadata,
        user,
       

     } = event ; 
  
 

 
     const payloadDB: IUser = {
         supabaseId: user.id,
         userName: user.user_metadata.full_name,
         email:user.email,
         provider: user.app_metadata.provider,
     }
 
     const saveUser = await createUser(payloadDB);
 
     console.log("Hii",saveUser)
 
     // Your validation/business logic here
 
     return res.status(200).json({
         saveUser
     });
   } catch (error) {
    console.error("❌ Webhook error",error);

    return res.status(401).json({
      error: "Invalid webhook",
    });
    
   }
};