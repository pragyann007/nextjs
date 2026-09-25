import type { Request,Response,NextFunction } from "express";
import { supabaseClient } from "../server.js";
import { findUserWithSupabaseId } from "../repiository/app.repiository.js";




export const isAuth = async(_req:Request ,
    _res:Response,
    _next:NextFunction)=>
{
    try {
        const token = _req.headers["authorization"];
        if(!token){
            return _res.status(401).json({message:"No token"})
        }
        const authToken = token.substring(7);
    
        const {data:{user},error}  = await supabaseClient.auth.getUser(authToken)
    
        if(error || !user){
            return _res.status(401).json({
                error: "Invalid or expired token",
              });
        }
    
        const appUser = await findUserWithSupabaseId(user.id)
        _req.user = appUser ; 
    
        _next()
    } catch (error) {
        return _res.status(401).json({
            error: "Unauthorized",
          });
        
    }

}
