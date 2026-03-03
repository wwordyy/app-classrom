

const adminUserService = require("../../services/admin/userService");

class UserController {

    async getAll(req, res) {

        try {
            const { page = 1, limit = 10, search = "", roleId, groupId } = req.query;

            const result = await adminUserService.getAll({
                page: Number(page),
                limit: Number(limit),
                search,
                roleId: roleId ? Number(roleId) : undefined,
                groupId: groupId !== undefined ? groupId : undefined,
            });

            return res.json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }


    async getById(req, res) {
        try {

            const user = await adminUserService.getById(Number(req.params.id));

            return res.json(user);
        } catch (e) {
            const status = e.message === "Пользователь не найден" ? 404 : 500;
            return res.status(status).json({ error: e.message });
        }
    }



    async create(req, res) {
        try {

            const { email, password, fullName, avatarUrl, isActive, roleId, groupId } = req.body;

            if (!email || !password || !fullName || !roleId) {
                return res.status(400).json({ error: "email, password, fullName, roleId обязательны" });
            }

            const user = await adminUserService.create({ email, password, fullName, avatarUrl, isActive, roleId, groupId });
            return res.status(201).json(user);
        } catch (e) {
            const status = e.message.includes("уже существует") ? 409 : 400;
            return res.status(status).json({ error: e.message });
        }
    }

    async update(req, res) {
        try {
            const user = await adminUserService.update(Number(req.params.id), req.body);

            return res.json(user);
        } catch (e) {
            if (e.message === "Пользователь не найден") return res.status(404).json({ error: e.message });

            if (e.message.includes("уже существует")) return res.status(409).json({ error: e.message });

            return res.status(400).json({ error: e.message });
        }
    }

    async remove(req, res) {
        try {
            await adminUserService.remove(Number(req.params.id));

            return res.json({ ok: true });
        } catch (e) {
            const status = e.message === "Пользователь не найден" ? 404 : 500;
            return res.status(status).json({ error: e.message });
        }
    }

    async toggleActive(req, res) {
        try {
            const user = await adminUserService.toggleActive(Number(req.params.id));
            
            return res.json(user);
        } catch (e) {
            const status = e.message === "Пользователь не найден" ? 404 : 500;
            return res.status(status).json({ error: e.message });
        }
    }
}

module.exports = new UserController();