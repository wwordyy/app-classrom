const practiceResultService = require('../../services/teacher/practiceResultService');

class PracticeResultController {

    async getResults(req, res) {

        try {
            const data = await practiceResultService.getResults(
                Number(req.params.groupId),
                req.user.id
            );

            return res.json(data);

        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async upsertResult(req, res) {

        try {

            const { grade, comment } = req.body;
            const result = await practiceResultService.upsertResult(
                Number(req.params.studentId),
                Number(req.params.groupId),
                req.user.id,
                Number(grade),
                comment
            );

            return res.json(result);
            
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new PracticeResultController();