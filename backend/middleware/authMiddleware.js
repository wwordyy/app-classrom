

const authService = require('../services/authService');
const { verifyRememberToken } = require('../util/tokens');


const authMiddleware = async (req, res, next) => {

    const token = req.headers.authorization?.startsWith("Bearer ") 
                            ? req.headers.authorization.split(" ")[1]
                            : req.cookies.accessToken;

    if (!token) {
        return req.status(401).json({
            error: "Необходимо авторизоваться!"
        });
    }

    try{
        const decoded = verifyRememberToken(token);
        req.user = decoded;
        return next();


    } catch (e) {
        return res.status(401).json({
            error: "Токен недействителен!"
        });
    }
}


module.exports = authMiddleware;