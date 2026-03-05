

const prisma = require('../../prisma/client');


class ProfileService {


    async getProfile (userID) {


        const user = await prisma.user.findUnique({
            where: { id: userID},
            select: {
                id: true, fullName: true, email: true,
                avatarUrl: true, createdAt: true,
                teachingGroups: {
                    include: {
                        students: {
                            select: { id: true, fullName: true, avatarUrl: true }
                        },
                        posts: { select: { id: true } },
                    },
                    take: 1,
                },
            },
        });

        const group = user.teachingGroups[0] ?? null;
        const gradedSubmissions = group ? await prisma.submission.count({
            where: { post: { groupId: group.id }, grade: { not: null } },
        }) : 0;

        return {
            id: user.id, fullName: user.fullName,
            email: user.email, avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            group: group ? {
                id: group.id, name: group.name,
                specialty: group.specialty, courseYear: group.courseYear,
                students: group.students,
            } : null,
            stats: {
                totalStudents: group?.students.length ?? 0,
                totalPosts: group?.posts.length ?? 0,
                gradedSubmissions,
            },
        };

    }


}


module.exports = new ProfileService();