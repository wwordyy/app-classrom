

module.exports = function (allowedRoles = []) {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                error: "Не авторизован"
            })
        };

        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Доступ запрещен"

            })

        };


        next();
    }

}