const bcrypt = require("bcryptjs");
const prisma = require("../../prisma/client");

const userSelect = {
    id: true,
    email: true,
    fullName: true,
    avatarUrl: true,
    isActive: true,
    createdAt: true,
    role: { select: { id: true, title: true } },
    studentGroup: { select: { id: true, name: true } },
};

class UserService {

    async getAll({ page, limit, search, roleId, groupId }) {
        const skip = (page - 1) * limit;

        const where = {
            AND: [
                search
                        ? {
                            OR: [
                                { fullName: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                            ],
                        }
                    : {},
                roleId ? { roleId } : {},
                groupId !== undefined
                    ? groupId === "null"
                        ? { groupId: null }
                        : { groupId: Number(groupId) }
                    : {},
            ],
        };

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: userSelect,
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count({ where }),
        ]);

        return { data, total, page, limit };
    }



    async getById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                ...userSelect,
                teachingGroups: { select: { id: true, name: true } },
            },
        });

        if (!user) throw new Error("Пользователь не найден");
        return user;
    }



    async create({ email, password, fullName, avatarUrl, isActive = true, roleId, groupId }) {

        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) throw new Error("Пользователь с таким email уже существует");

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                avatarUrl: avatarUrl || null,
                isActive,
                roleId: Number(roleId),
                groupId: groupId ? Number(groupId) : null,
            },
            select: userSelect,
        });

        return user;
    }

    async update(id, { email, password, fullName, avatarUrl, isActive, roleId, groupId }) {

        const existing = await prisma.user.findUnique({ where: { id } });

        if (!existing) throw new Error("Пользователь не найден");

        if (email && email !== existing.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) throw new Error("Пользователь с таким email уже существует");
        }

        const data = {};
        if (email !== undefined) data.email = email;
        if (fullName !== undefined) data.fullName = fullName;
        if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
        if (isActive !== undefined) data.isActive = isActive;
        if (roleId !== undefined) data.roleId = Number(roleId);
        if (groupId !== undefined) data.groupId = groupId ? Number(groupId) : null;
        if (password) data.passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { id },
            data,
            select: userSelect,
        });

        return user;
    }

    async remove(id) {

        const existing = await prisma.user.findUnique({ where: { id } });

        if (!existing) throw new Error("Пользователь не найден");

        await prisma.user.delete({ where: { id } });
    }

    async toggleActive(id) {

        const user = await prisma.user.findUnique({ where: { id }, select: { isActive: true } });

        if (!user) throw new Error("Пользователь не найден");

        return prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, isActive: true },
        });
    }
}

module.exports = new UserService();