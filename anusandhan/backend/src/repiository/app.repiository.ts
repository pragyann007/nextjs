import type { IUser } from "../controllers/auth.controllers.js";
import { prisma } from "../lib/client.js"
import type { MessageHistory } from "../services/app.services.js";


export const getChatHistory = async (id: string) => {
  try {
    const res = await prisma.messages.findMany({
      where: {
        conversationId: id
      },


    })
    return res;

  } catch (error) {
    return [];

  }
}

export const createConversation = async (userId: string, title: string) => {
  const res = await prisma.conversations.create({
    data: { // Generate a unique ID
      title,
      userId
    }
  })

  return res.id;
}


export const createMessages = async (conversationId: string, humanMessage: MessageHistory, aiMessage: MessageHistory) => {

  const res = await prisma.$transaction(async (tx) => {
    const humanMessageChat = await tx.messages.create({
      data: {
        conversationId,
        content: humanMessage.content,
        messageBy: "USER"
      }
    })
    const aiMessageChat = await tx.messages.create({
      data: {
        conversationId,
        content: aiMessage.content,
        messageBy: "AI"
      }
    })
    return { humanMessageChat, aiMessageChat }
  })


}

export const createUser = async (data: IUser) => {
  const res = await prisma.user.create({
    data: {
      email: data.email,
      username: data.userName,
      provider: data.provider,
      supabaseId: data.supabaseId
    }
  })

  return res;
}


export const findUserWithSupabaseId = async(supabaseId:string)=>{
  const res = await prisma.user.findUnique({
    where:{
      supabaseId
    }
  })

  return res ; 
}

