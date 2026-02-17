
const authService = require('../services/authService');

class AuthController {


    async register (req, res) {

        try{
            const { email, password, fullName } = req.body; 

            if (!email || !password || !fullName) {
                
                return res.status(400).json({
                    error: "Все поля обязательны к заполнению!"
                })

            }

            const user = await authService.register(email, password, fullName);

            res.status(201).json(user);


        } catch (e) {

            res.status(400).json({
                error: e.message

            })

        }


    }


    async login(req, res) {

        try{
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: "Email и пароль обязательны к заполнению!"

                });

            }

            const result = await authService.login(email, password);

            res.cookie("accessToken", result.token, {
                httpOnly: true, 
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })


            return res.json({
                accessToken: result.token,
            })

        } catch (e) {
            return res.status(400).json({
                error: e.message

            });

        }

    } 


    async logout(req, res) {

        res.clearCookie("accessToken", {
            httpOnly: true, 
            secure: false,
            sameSite: "lax",
            maxAge: 0,
            path: '/'
    })        

    res.status(200).json({
        ok: true
    })

    }

}


module.exports = new AuthController();