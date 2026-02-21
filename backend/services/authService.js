const bcrypt = require("bcryptjs");
const { generatedRememberToken } = require("../util/tokens");


const prisma = require('../prisma/client')

class AuthService {


    async register(email, password, fullName) {
        
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if (existingUser) {
            throw new Error("Такой пользователь уже существует!");
        }

        const hashedPswd = await bcrypt.hash(password, 10);

        console.log("We're here")
        const user = await prisma.user.create({
            data: {
                email: email,
                passwordHash: hashedPswd,
                fullName: fullName,
                isActive: true,
                role: {
                    connect: { title: "observer" }
                }
            }

        })

        return {
            id: user.id,
            email: user.email
        }

    }



    async login(email, password){

        const user = await prisma.user.findUnique({
            where: {email: email},
            include: {role: true}
        });

        if (!user || !await bcrypt.compare(password, user.passwordHash)){
            throw new Error("Неправильный логин или пароль!");
        }

        const payload = {
            id: user.id,
            role: user.role.title,
        }

        const token = generatedRememberToken(payload);

        return {
            token
        }


    }

}


module.exports = new AuthService();