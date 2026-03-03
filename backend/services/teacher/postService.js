const prisma = require('../../prisma/client');

const POST_TYPES = {
    TASK:       'Задание',
    METHODICAL: 'Методический материал',
    FINAL:      'Итоговая практика',
    DIARY:      'Дневник практики',
};


class PostService {

    async createPost(userId, data, fileUrl = null) {
        const { title, content, dueDate, maxScore, groupId, typePostId, weeks, isFinal } = data;

        // Проверяем группу
        const group = await prisma.group.findFirst({
            where: { id: Number(groupId), teacherId: Number(userId) },
            include: { students: true },
        });
        if (!group) throw new Error('Вы не можете создавать задания для этой группы');

        // Получаем тип поста
        const typePost = await prisma.typePost.findUnique({
            where: { id: Number(typePostId) },
        });
        if (!typePost) throw new Error('Тип задания не найден');

        // Проверка единственности для Итоговой практики и Дневника
        if ([POST_TYPES.FINAL, POST_TYPES.DIARY].includes(typePost.title)) {
            const existing = await prisma.post.findFirst({
                where: { groupId: Number(groupId), typePost: { title: typePost.title } },
            });
            if (existing) throw new Error(`"${typePost.title}" для этой группы уже существует`);
        }

        // Обработка даты дедлайна
        let due = null;
        if ([POST_TYPES.TASK, POST_TYPES.FINAL].includes(typePost.title)) {
            if (!dueDate) throw new Error('Укажите дату сдачи');
            due = new Date(dueDate);
            if (isNaN(due.getTime())) throw new Error('Некорректная дата дедлайна');
        }

        // Обработка недель для Дневника практики
        let parsedWeeks = undefined;
        if (typePost.title === POST_TYPES.DIARY) {
            parsedWeeks = typeof weeks === 'string' ? JSON.parse(weeks) : weeks;
            if (!parsedWeeks || !Array.isArray(parsedWeeks) || parsedWeeks.length === 0) {
                throw new Error('Заполните план по неделям');
            }
            if (parsedWeeks.length > 4) throw new Error('Максимум 4 недели');
        }

        // Нужно ли создавать submissions (для Задания и Итоговой практики)
        const needsSubmissions = [POST_TYPES.TASK, POST_TYPES.FINAL].includes(typePost.title);

        const post = await prisma.post.create({
            data: {
                title,
                content,
                dueDate: due ?? undefined,
                maxScore: maxScore ? Number(maxScore) : 0,
                groupId: Number(groupId),
                typePostId: Number(typePostId),
                fileUrl,
                isFinal: typePost.title === POST_TYPES.FINAL,
                weeks: parsedWeeks,
                ...(needsSubmissions && {
                    submissions: {
                        create: group.students.map(s => ({
                            userId: s.id,
                            statusSubmissionId: 1, // "Не отправлено"
                        })),
                    },
                }),
            },
            include: { typePost: true },
        });

        return post;
    }

    async updatePost(postId, userId, data) {
        const post = await prisma.post.findFirst({
            where: { id: Number(postId), group: { teacherId: Number(userId) } },
            include: { typePost: true },
        });
        if (!post) throw new Error('Пост не найден или нет доступа');

        const { title, content, dueDate, maxScore, weeks } = data;

        let parsedWeeks = undefined;
        if (post.typePost?.title === POST_TYPES.DIARY && weeks) {
            parsedWeeks = typeof weeks === 'string' ? JSON.parse(weeks) : weeks;
            if (!Array.isArray(parsedWeeks) || parsedWeeks.length > 4) {
                throw new Error('Максимум 4 недели');
            }
        }

        return prisma.post.update({
            where: { id: Number(postId) },
            data: {
                title,
                content,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                maxScore: maxScore ? Number(maxScore) : undefined,
                weeks: parsedWeeks,
            },
            include: { typePost: true },
        });
    }

    async getTypePosts() {
        return prisma.typePost.findMany({ orderBy: { id: 'asc' } });
    }

    async getPostSubmissions(postId) {
        return prisma.post.findUnique({
            where: { id: Number(postId) },
            include: {
                typePost: true,
                submissions: {
                    include: {
                        student: { select: { id: true, fullName: true, email: true } },
                        statusSubmission: { select: { id: true, title: true } },
                    },
                },
            },
        });
    }
}

module.exports = new PostService();