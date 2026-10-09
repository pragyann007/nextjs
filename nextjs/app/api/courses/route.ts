import { NextRequest } from "next/server";


export async function POST(Request:NextRequest){
    const body =await Request.json();
    const {courseId,course,author,duration} = body;
    

    const response = {
        status:201,
        message:"Created",
        data:{
            courseId,
            course,
            duration,
            author
        }
    }
    return Response.json(response);


}