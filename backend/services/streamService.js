
const prisma = require('../prisma/client')


class StreamService {

async createStream(data) {

        if (!data.groups || data.groups.length === 0) {
            throw new Error("Необходимо выбрать хотя бы одну группу!");
        }

        const uniqueGroupsMap = new Map();
        data.groups.forEach(g => {
            if (!uniqueGroupsMap.has(g.groupId)) {
                uniqueGroupsMap.set(g.groupId, g);
            }
        });
        const uniqueGroups = Array.from(uniqueGroupsMap.values());

        for (const g of uniqueGroups) {

            if (!g.groupId || !g.teacherId) {
                throw new Error('groupId и teacherId обязательны для каждой группы');
            }

            const teacher = await prisma.user.findUnique({
                where: { id: g.teacherId },
                include: { role: true }
            });

            if (!teacher || teacher.role.title.toLowerCase() !== 'teacher') {
                throw new Error(`Пользователь ${g.teacherId} не является преподавателем`);
            }

            const group = await prisma.group.findUnique({
                where: { id: g.groupId }
            });

            if (!group) {
                throw new Error(`Группа ${g.groupId} не существует`);
            }
        }

        const stream = await prisma.stream.create({
            data: {
                title: data.title,
                description: data.description || "",
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            }
        });

        const streamGroupData = uniqueGroups.map(g => ({
            streamId: stream.id,
            groupId: g.groupId,
            teacherId: g.teacherId,
        }));

        await prisma.streamGroup.createMany({
            data: streamGroupData,
            skipDuplicates: true, 
        });

        return stream;
    }

}


module.exports = new StreamService();