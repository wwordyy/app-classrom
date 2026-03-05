

const prisma = require('../../prisma/client');

class StudentProfileService {

    async getProfile(userId) {

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
                studentGroup: {
                    select: {
                        id: true,
                        name: true,
                        specialty: true,
                        courseYear: true,
                        teacher: {
                            select: { id: true, fullName: true, email: true, avatarUrl: true },
                        },
                    },
                },
                practiceResultsAsStudent: {
                    select: {
                        grade: true,
                        comment: true,
                        gradedAt: true,
                        teacher: { select: { fullName: true } },
                    },
                    take: 1,
                },
                submissions: {
                    select: { grade: true, statusSubmissionId: true },
                },
            },
        });

        if (!user) throw new Error('Пользователь не найден');

        const total    = user.submissions.length;

        const submitted = user.submissions.filter(s => s.statusSubmissionId >= 2).length;

        const graded   = user.submissions.filter(s => s.grade != null).length;

        const avgGrade = graded > 0
            ? (user.submissions.reduce((acc, s) => acc + (s.grade ?? 0), 0) / graded).toFixed(1)
            : null;

        return {
            id:        user.id,
            fullName:  user.fullName,
            email:     user.email,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            group: user.studentGroup ?? null,
            teacher: user.studentGroup?.teacher ?? null,
            practiceResult: user.practiceResultsAsStudent[0] ?? null,
            stats: { total, submitted, graded, avgGrade },
        };
    }
}

module.exports = new StudentProfileService();