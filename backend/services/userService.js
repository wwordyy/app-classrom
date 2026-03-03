
const prisma = require('../prisma/client')

class UserService {

    async getMe(userId){

        const user = await prisma.user.findUnique({
            where: { id: userId},
            select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                role: {
                    select: { title: true }
                }
            }
        })

        return user;
    }

    async getUsersByRole(roleName) {

        if (!roleName) {
            throw new Error("Название роли обязательный параметр!");
        }

        const users = await prisma.user.findMany({
            where: {
                role: {
                    title: roleName,
                },
                isActive: true
            },
            select: {
                id: true,
                fullName: true,
                email:  true,
                avatarUrl: true,
                role: {
                    select: {
                        title: true,
                    }
                } 
            }
        })

        return users;

    }


    async getFreeTeachers() {

        console.log("We're here")

        const teachers = await prisma.user.findMany({
            where: {
                role: { title: "teacher" },
                teachingGroups: { none: {} }
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
            }

        })

        return teachers;

    }
}


module.exports = new UserService();