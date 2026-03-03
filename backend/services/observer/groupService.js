
const prisma = require('../../prisma/client');


class GroupService{

    async getGroups () {

        const data = prisma.group.findMany(
            {
                orderBy: {
                    id: 'asc',
                },
                select: {
                    id: true,
                    name: true,
                    courseYear: true,
                    specialty: true,
                    teacher: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    },
                    _count: {
                        select: {
                            students: true,
                            posts: true,
                        }
                    }
                }
            }
        )

        return data;
    }


    async assignTeacher(groupId, teacherId) {

        const group = prisma.group.findUnique({
            where: { id: Number(groupId) }
        })

        if (!group) throw new Error(`Групаа с ID: ${groupId} не найдена!`)

        const teacher = prisma.user.findUnique({
            where: {
                id: Number(teacherId),
                role: {title: "teacher"}
            }
        })

        if (!teacher) throw new Error(`Учитель с ID: ${teacherId} не найден!`)

        
        const alreadyAssigned = await prisma.group.findUnique({
            where: {
                teacherId: Number(teacherId)
            }

        })

        if (alreadyAssigned) {
            throw new Error('Этот преподаватель уже назначен на другую группу');
        }

        await prisma.group.update({
            where: {
                id: Number(groupId),
            },
            data: {
                teacherId: Number(teacherId)
            }


        })

        return {
            ok: true
        }
    }


    async removeTeacher(groupId) {

        const group = await prisma.group.findUnique({
            where: {
                id: Number(groupId)
            }
        });

        if (!group) throw new Error("Такой группы не найдено!");

        if (!group.teacherId) throw new Error("У группы нет преподавателя!");

        await prisma.group.update({

            where: {
                id: Number(groupId)
            },
            data: {
                teacherId: null
            }

        })

        return { ok: true }

    }
}   


module.exports = new GroupService();