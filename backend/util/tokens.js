const jwt = require("jsonwebtoken");

const REMEMBER_JWT_SECRET = process.REMEMBER_JWT_SECRET;

const generatedRememberToken = (payload) => {

    return jwt.sign(payload, REMEMBER_JWT_SECRET, {
        expiresIn: "7d"
    });

}

const verifyRememberToken = (token) => {

    return jwt.verify(token, REMEMBER_JWT_SECRET);
}


module.exports = {
    verifyRememberToken,
    generatedRememberToken

}