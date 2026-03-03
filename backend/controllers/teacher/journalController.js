

const journalService = require('../../services/teacher/journalService');


class JournalController {

    async getGroupStudents(req, res) {

        try {

            const data = await journalService.getGroupStudents(req.user.id);
            if (!data) return res.status(404).json({ message: "Группа не найдена" });

            res.status(200).json(data);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    async getStudentGrades(req, res) {

        try {

            const data = await journalService.getStudentGrades(req.user.id, req.params.studentId);

            if (!data) return res.status(404).json({ message: "Не найдено" });
            res.status(200).json(data);

        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }


}


module.exports = new JournalController();