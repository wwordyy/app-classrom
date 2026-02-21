
const userService = require ('../services/userService');


class UserController {

    async getMe(req, res){

        try {

            const user = await userService.getMe(req.user.id);

            if (user) {

                return res.status(200).json(user)
            }

            return res.status(500).json({
                error: "Ошибка получения личных данных!"
            })

        } 
        catch (e) {

            return res.status(400).json({
                error: e.message
            })
        }
    }

    async getUsersByRole(req, res) {

        try {

            const role = req.query.role;

            const data = await userService.getUsersByRole(role);

            return res.status(200).json(data)
            

        }
        catch (e) {
            return res.status(400).json({
                error: e.message
            })
        }

    }

}


module.exports = new UserController();