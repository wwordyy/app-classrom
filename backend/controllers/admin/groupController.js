

const adminGroupService = require("../../services/admin/groupService");

class GroupController {

    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;

            const result = await adminGroupService.getAll({
                page: Number(page),
                limit: Number(limit),
                search,
            });

            return res.json(result);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }

    async getById(req, res) {
        try {

            const group = await adminGroupService.getById(Number(req.params.id));

            return res.json(group);
        } catch (e) {
            const status = e.message === "Группа не найдена" ? 404 : 500;

            return res.status(status).json({ error: e.message });
        }
    }

    async create(req, res) {
        try {

            const { name, courseYear, specialty, teacherId } = req.body;

            if (!name || !courseYear || !specialty) {
                return res.status(400).json({ error: "name, courseYear, specialty обязательны" });
            }

            const group = await adminGroupService.create({ name, courseYear, specialty, teacherId });
            return res.status(201).json(group);

        } catch (e) {
            const status = e.message.includes("уже существует") ? 409 : 400;
            return res.status(status).json({ error: e.message });
        }
    }

    async update(req, res) {

        try {
            const group = await adminGroupService.update(Number(req.params.id), req.body);

            return res.json(group);
        } catch (e) {

            if (e.message === "Группа не найдена") return res.status(404).json({ error: e.message });

            if (e.message.includes("уже существует")) return res.status(409).json({ error: e.message });

            return res.status(400).json({ error: e.message });
        }
    }

    async remove(req, res) {
        try {
            
            await adminGroupService.remove(Number(req.params.id));

            return res.json({ ok: true });
        } catch (e) {
            const status = e.message === "Группа не найдена" ? 404 : 500;

            return res.status(status).json({ error: e.message });
        }
    }
}

module.exports = new GroupController();