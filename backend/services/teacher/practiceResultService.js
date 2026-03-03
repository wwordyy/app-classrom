const prisma = require('../../prisma/client');

class PracticeResultService {

    async getResults(groupId, teacherId) {


        const group = await prisma.group.findFirst({

            where: { id: Number(groupId), teacherId: Number(teacherId) },
            include: {
                students: {
                    select: {
                        id: true, fullName: true, email: true, avatarUrl: true,
                        documentParts: {
                            where: { groupId: Number(groupId) },
                            include: { documentType: true },
                            orderBy: { documentType: { orderIndex: 'asc' } },
                        },
                        practiceResultsAsStudent: {
                            where: { groupId: Number(groupId) },
                            select: { id: true, grade: true, comment: true, gradedAt: true },
                        },
                    },
                },
            },
        });

        if (!group) throw new Error('Группа не найдена или нет доступа');

        return group.students.map(s => ({
            id: s.id,
            fullName: s.fullName,
            email: s.email,
            avatarUrl: s.avatarUrl,
            documentParts: s.documentParts,
            practiceResult: s.practiceResultsAsStudent[0] ?? null,
        }));
    }

    async upsertResult(studentId, groupId, teacherId, grade, comment) {

        const group = await prisma.group.findFirst({
            where: { id: Number(groupId), teacherId: Number(teacherId) },
        });

        if (!group) throw new Error('Нет доступа к этой группе');

        const student = await prisma.user.findFirst({
            where: { id: Number(studentId), groupId: Number(groupId) },
        });
        
        if (!student) throw new Error('Студент не найден в этой группе');

        if (grade < 1 || grade > 5) throw new Error('Оценка должна быть от 1 до 5');

        return prisma.practiceResult.upsert({
            where: {
                studentId_groupId: {
                    studentId: Number(studentId),
                    groupId: Number(groupId),
                },
            },
            create: {
                studentId: Number(studentId),
                groupId: Number(groupId),
                teacherId: Number(teacherId),
                grade: Number(grade),
                comment: comment ?? null,
            },
            update: {
                grade: Number(grade),
                comment: comment ?? null,
                gradedAt: new Date(),
            },
        });
    }
}

module.exports = new PracticeResultService();