const prisma = require('../../prisma/client');

class StudentPracticeService {

    async getPracticeInfo(userId) {

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { groupId: true },
        });

        if (!user?.groupId) throw new Error('Студент не привязан к группе');


        const practiceResult = await prisma.practiceResult.findUnique({
            where: {
                studentId_groupId: {
                    studentId: Number(userId),
                    groupId: user.groupId,
                },
            },
            include: {
                teacher: { select: { fullName: true } },
            },
        });

        const posts = await prisma.post.findMany({
            where: {
                groupId: user.groupId,
                dueDate: { not: null },
                typePost: {
                    title: { in: ['Задание', 'Итоговая практика'] },
                },
            },
            include: {
                typePost: { select: { title: true } },
                submissions: {
                    where: { userId: Number(userId) },
                    select: {
                        grade: true,
                        submittedAt: true,
                        statusSubmission: { select: { title: true } },
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });

        return {
            practiceResult: practiceResult ? {
                grade:     practiceResult.grade,
                comment:   practiceResult.comment,
                gradedAt:  practiceResult.gradedAt,
                teacher:   practiceResult.teacher.fullName,
            } : null,
            posts: posts.map(p => ({
                id:       p.id,
                title:    p.title,
                dueDate:  p.dueDate,
                maxScore: p.maxScore,
                typePost: p.typePost?.title ?? null,
                grade:    p.submissions[0]?.grade ?? null,
                status:   p.submissions[0]?.statusSubmission?.title ?? 'Не сдано',
                submittedAt: p.submissions[0]?.submittedAt ?? null,
            })),
        };
    }
}

module.exports = new StudentPracticeService();