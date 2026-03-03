const prisma = require("../../prisma/client");

const groupSelect = {
    id: true,
    name: true,
    courseYear: true,
    specialty: true,
    teacher: { select: { id: true, fullName: true, email: true } },
    _count: { select: { students: true } },
};


class GroupService {

    async getAll({ page, limit, search }) {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                  OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      { specialty: { contains: search, mode: "insensitive" } },
                  ],
              }
            : {};

        const [data, total] = await Promise.all([
            prisma.group.findMany({
                where,
                skip,
                take: limit,
                select: groupSelect,
                orderBy: { name: "asc" },
            }),
            prisma.group.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getById(id) {
        const group = await prisma.group.findUnique({
            where: { id },
            select: {
                ...groupSelect,
                students: {
                    select: { id: true, fullName: true, email: true, isActive: true },
                },
            },
        });

        if (!group) throw new Error("Группа не найдена");
        return group;
    }


    async create({ name, courseYear, specialty, teacherId }) {
        const existing = await prisma.group.findUnique({ where: { name } });
        if (existing) throw new Error("Группа с таким названием уже существует");

        const group = await prisma.group.create({
            data: {
                name,
                courseYear: Number(courseYear),
                specialty,
                teacherId: teacherId ? Number(teacherId) : null,
            },
            select: groupSelect,
        });

        return group;
    }


    async update(id, { name, courseYear, specialty, teacherId }) {
        const existing = await prisma.group.findUnique({ where: { id } });
        if (!existing) throw new Error("Группа не найдена");

        if (name && name !== existing.name) {
            const nameTaken = await prisma.group.findUnique({ where: { name } });
            if (nameTaken) throw new Error("Группа с таким названием уже существует");
        }

        const data = {};
        if (name !== undefined) data.name = name;
        if (courseYear !== undefined) data.courseYear = Number(courseYear);
        if (specialty !== undefined) data.specialty = specialty;
        if (teacherId !== undefined) data.teacherId = teacherId ? Number(teacherId) : null;

        const group = await prisma.group.update({
            where: { id },
            data,
            select: groupSelect,
        });

        return group;
    }

    async remove(id) {
        const existing = await prisma.group.findUnique({ where: { id } });
        if (!existing) throw new Error("Группа не найдена");

        await prisma.group.delete({ where: { id } });
    }
}

module.exports = new GroupService();