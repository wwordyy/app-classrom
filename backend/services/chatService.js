

const prisma = require('../prisma/client');

class ChatService {


    async createChat(teacherId, observerId) {


        const observerChats = await prisma.chatUser.findMany({
        where: { userId: observerId },
        select: { chatId: true }
    });

    const chatIds = observerChats.map(c => c.chatId);

    const existing = await prisma.chatUser.findFirst({
        where: {
            userId: teacherId,
            chatId: { in: chatIds }
        }
    });

    if (existing) {
        const chat = await prisma.chat.findUnique({
            where: { id: existing.chatId },
            include: {
                users: {
                    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
        return chat;
    }

    const chat = await prisma.chat.create({
        data: {
            users: {
                create: [
                    { userId: observerId },
                    { userId: teacherId }
                ]
            }
        },
        include: {
            users: {
                include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }
            },
            messages: true
        }
    });

    return chat;

    }


    async getChats(userId) {

        const chats = await prisma.chat.findMany({
            where: {
                users: { some: { userId } }
            },
            include: {
                users: {
                    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1 
                }
            }
        });

        return chats;

    }



    async getMessages(chatId, userId) {

        const member = await prisma.chatUser.findUnique({
            where: {
                chatId_userId: {
                    chatId: Number(chatId), userId
                }
            }

        });

        if (!member) {
            throw new Error("Нет доступа к чату!");
        }

        const messages = await prisma.chatMessage.findMany({
            where: { chatId: Number(chatId) },
            include: { author: { select: { id: true, fullName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' }

        });


        return messages;
    }


    async sendMessage(chatId, content, userId) {

        const message = await prisma.chatMessage.create({
            data: {
                content,
                authorId: userId,
                chatId: Number(chatId)
            },
            include: { author: { select: { id: true, fullName: true, avatarUrl: true } } }
        });

        return message;

    }
}

module.exports = new ChatService();