

const prisma = require('../../prisma/client');

class TeacherService {



    async getTeacherDashboard(userId) {

        const groups = await prisma.group.findMany({
            where: { teacherId: userId },
            include: {
            students: {
                select: {
                id: true,
                fullName: true,
                email: true,
                },
            },
           posts: {
                include: {
                    submissions: true,
                    typePost: true, 
                },
                orderBy: {
                    dueDate: "asc",
                },
                },
            },
        });

        const dashboard = groups.map(group => {

        const postsWithCounts = group.posts.map(post => {

            const totalSubmissions = post.submissions.length;
            const submittedCount = post.submissions.filter(s => s.statusSubmissionId !== 1).length; // 1 = "Не отправлено"

            return {
            ...post,
            totalSubmissions,
            submittedCount,
            };
        });

        return {
            ...group,
            posts: postsWithCounts,
        };
        });

        return dashboard;

    }

}

module.exports = new TeacherService();