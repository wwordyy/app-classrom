
const prisma = require('../../prisma/client');

class ProfileService {


    async getProfile (userId) {
        
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                chats: {
                    select: {
                        chat: {
                            select: {
                                _count: { select: { messages: true } }
                            }
                        }
                    }
                },
            },
        });

        const totalChats    = user.chats.length;
        const totalMessages = user.chats.reduce(
            (acc, cu) => acc + cu.chat._count.messages, 0
        );

        return {
            id: user.id, fullName: user.fullName,
            email: user.email, avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            stats: { totalChats, totalMessages },
        };


    }

}

module.exports = new ProfileService();