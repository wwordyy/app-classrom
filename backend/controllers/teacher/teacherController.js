
const teacherService = require('../../services/teacher/teacherService')

class TeacherController {


    async  getTeacherDashboard(req, res) {

        try{

            const userId = req.user.id;

            const data = await teacherService.getTeacherDashboard(userId);


            return res.status(200).json(data);


        } catch (e) {
            return res.status(400).json({ error: e.message });

        }
        

    }



}

module.exports = new TeacherController();