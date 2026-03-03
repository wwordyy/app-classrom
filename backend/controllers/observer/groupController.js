
const groupService = require('../../services/observer/groupService');


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

    async assignTeacher (req, res) {

        try {

            const { groupId } = req.params;
            const { teacherId } = req.body;

            const data = await groupService.assignTeacher(groupId, teacherId);

            return res.status(200).json(data);

        } catch (e) {
            
            return res.status(400).json({
                error: e.message
            })

        }

    }

    async removeTeacher(req, res) {

        try {

            const { groupId } = req.params;
            const result = await groupService.removeTeacher(groupId);
            
            return res.status(200).json(result);

        } catch (e) {
            
            return res.status(400).json({
                error: e.message
            })


        }

    }
}


module.exports = new GroupController();