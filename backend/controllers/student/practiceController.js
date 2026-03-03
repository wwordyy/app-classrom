

const practiceService = require('../../services/student/practiceService');

class StudentPracticeController {
    async getPracticeInfo(req, res) {

        try {

            const data = await practiceService.getPracticeInfo(req.user.id);
            return res.json(data);
            
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new StudentPracticeController();