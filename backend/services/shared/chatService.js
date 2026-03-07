

const prisma = require('../../prisma/client');

class ChatService {


    async createChat(userIdA, userIdB) {
    
        const chatsOfA = await prisma.chatUser.findMany({
            where: { userId: userIdA },
            select: { chatId: true }
        });

        const chatIds = chatsOfA.map(c => c.chatId);

        const existing = await prisma.chatUser.findFirst({
            where: {
                userId: userIdB,
                chatId: { in: chatIds }
            }
        });

        if (existing) {
            return prisma.chat.findUnique({
                where: { id: existing.chatId },
                include: {
                    users: {
                        include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }
                    },
                    messages: { orderBy: { createdAt: 'desc' }, take: 1 }
                }
            });
        }

        return prisma.chat.create({
            data: {
                users: {
                    create: [{ userId: userIdA }, { userId: userIdB }]
                }
            },
            include: {
                users: {
                    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }
                },
                messages: true
            }
        });
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