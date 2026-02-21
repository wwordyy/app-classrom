
const groupService = require('../services/groupService');


class GroupController {


    async getGroups (req, res) {

        try {
            const data = await groupService.getGroups();

            return res.status(200).json(data)


        } catch (e) {

            return res.status(400).json({
                error: e.message
            })
        }

    }


}


module.exports = new GroupController();