const profileService = require('../../services/student/profileService');

class StudentProfileController {
    async getProfile(req, res) {
        try {
            const data = await profileService.getProfile(req.user.id);
            return res.json(data);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new StudentProfileController();