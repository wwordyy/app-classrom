

const profileService = require('../../services/teacher/profileService')


class ProfileController {


    async getProfile (req, res) {

        try{

            const data = await profileService.getProfile(req.user.id);

            return res.status(200).json(data);

        }
        catch (e) {

            return res.status(400).json({
                error: e.message,
            });

        }
    }


}

module.exports = new ProfileController();