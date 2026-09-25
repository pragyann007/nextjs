import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { authRouter } from "./routes/auth.routes.js"
import { appRouter } from "./routes/app.routes.js"
import { prisma } from "./lib/client.js"
import { tavily } from "@tavily/core"
import { createClient } from "@supabase/supabase-js"
dotenv.config()

export const client = tavily({
    apiKey:process.env.TAVILY_API_KEY!
})

export const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
    
)

const app = express()
const port = process.env.PORT || 8080 ; 

// middlwares
app.use(cookieParser())

// health check
app.get('/health',(_,res)=>{
    res.status(200).json({
        message:"All okay !",
        statusCode:200
    })
})



// route midleware
app.use("/api/v1/auth",authRouter)
app.use(express.json())

app.use("/api/v1/app",appRouter)



app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})
