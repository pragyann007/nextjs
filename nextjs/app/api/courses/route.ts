import { NextResponse } from "next/server";
export async function GET() {
    return NextResponse.json({
        "name":"Pragyan",
        "age":"19",
        "isSkilled":true
    })
}

async function POST() {
    
    
}