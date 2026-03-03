

const prisma = require('../../prisma/client');


class JournalService {

    async getGroupStudents(teacherId) {
        const group = await prisma.group.findFirst({
            where: { teacherId },
            include: {
                students: {
                    select: { id: true, fullName: true, email: true }
                }
            }
        });

        if (!group) return null;

        return {
            groupName: group.name,
            students: group.students
        };
    }

    async getStudentGrades(teacherId, studentId) {
        const group = await prisma.group.findFirst({
            where: { teacherId },
            include: {
                posts: {
                    include: {
                        submissions: {
                            where: { userId: Number(studentId) },
                            select: { grade: true, feedBackTeacher: true, statusSubmission: true, submittedAt: true }
                        },
                        typePost: { select: { title: true } }
                    },
                    orderBy: { dueDate: 'asc' }
                }
            }
        });

        if (!group) return null;

        const student = await prisma.user.findUnique({
            where: { id: Number(studentId) },
            select: { id: true, fullName: true, email: true }
        });

        return {
            groupName: group.name,
            groupId: group.id,
            student,
            posts: group.posts.map(post => {
                const sub = post.submissions[0] ?? null;
                return {
                    id: post.id,
                    title: post.title,
                    dueDate: post.dueDate,
                    maxScore: post.maxScore,
                    typePost: post.typePost?.title ?? "-",
                    grade: sub?.grade ?? null,
                    feedBackTeacher: sub?.feedBackTeacher ?? null,
                    status: sub?.statusSubmission?.title ?? "Не сдано",
                    submittedAt: sub?.submittedAt ?? null,
                };
            })
        };
    }


}

module.exports = new JournalService();