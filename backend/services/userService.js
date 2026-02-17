
const prisma = require('../prisma/client')

class UserService {

    async getMe(userId){

        const user = await prisma.user.findUnique({
            where: { id: userId},
            select: {
                id: true,
                fullName: true,
                email: true,
                role: {
                    select: { title: true }
                }
            }
        })

        return user;
    }
}


module.exports = new UserService();