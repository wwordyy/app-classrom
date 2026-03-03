const prisma = require('../../prisma/client');

class PostCommentService {

    async getComments(postId, userId) {

        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
            select: { groupId: true },
        });


        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { groupId: true, role: { select: { title: true } } },
        });

        const isTeacher = user?.role?.title === 'teacher';

        if (!isTeacher && user?.groupId !== post.groupId) {
            throw new Error('Нет доступа');
        }

        const comments = await prisma.postComment.findMany({
            where: {
                postId: Number(postId),
                parentId: null,
            },
            include: {
                author: {
                    select: { id: true, fullName: true, avatarUrl: true },
                },
                replies: {
                    include: {
                        author: {
                            select: { id: true, fullName: true, avatarUrl: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        return comments;
    }

    async createComment(postId, userId, content) {

        if (!content?.trim()) throw new Error('Комментарий не может быть пустым');

        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
            select: { groupId: true },
        });

        if (!post) throw new Error('Пост не найден');

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { groupId: true },
        });

        if (user?.groupId !== post.groupId) {
            throw new Error('Нет доступа к этому посту');
        }

        const comment = await prisma.postComment.create({
            data: {
                content: content.trim(),
                postId: Number(postId),
                authorId: Number(userId),
                parentId: null,
            },
            include: {
                author: {
                    select: { id: true, fullName: true, avatarUrl: true },
                },
                replies: true,
            },
        });

        return comment;
    }

    async replyComment(postId, parentId, userId, content) {

        if (!content?.trim()) throw new Error('Ответ не может быть пустым');

        const parent = await prisma.postComment.findUnique({
            where: { id: Number(parentId) },
            select: { id: true, postId: true, parentId: true },
        });

        if (!parent) throw new Error('Комментарий не найден');

        if (parent.parentId !== null) {
            throw new Error('Нельзя отвечать на ответ');
        }

        if (parent.postId !== Number(postId)) {
            throw new Error('Комментарий не принадлежит этому посту');
        }

        const reply = await prisma.postComment.create({
            data: {
                content: content.trim(),
                postId: Number(postId),
                authorId: Number(userId),
                parentId: Number(parentId),
            },
            include: {
                author: {
                    select: { id: true, fullName: true, avatarUrl: true },
                },
            },
        });

        return reply;
    }

    async deleteComment(commentId, userId) {

        const comment = await prisma.postComment.findUnique({
            where: { id: Number(commentId) },
            select: { authorId: true, replies: { select: { id: true } } },
        });

        if (!comment) throw new Error('Комментарий не найден');

        if (comment.authorId !== Number(userId)) {
            throw new Error('Нельзя удалить чужой комментарий');
        }

        if (comment.replies?.length > 0) {
            await prisma.postComment.deleteMany({
                where: { parentId: Number(commentId) },
            });
        }

        await prisma.postComment.delete({
            where: { id: Number(commentId) },
        });

        return { ok: true };
    }
}

module.exports = new PostCommentService();