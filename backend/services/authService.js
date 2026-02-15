const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { generatedRememberToken } = require("../util/tokens");


const prisma = new PrismaClient();

class AuthService {


    async register(email, password, fullName) {
        
        const existingUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if (existingUser) {
            throw new Error("Такой пользователь уже существует!");
        }

        const hashedPswd = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({
            data: {
                email: email,
                passwordHash: hashedPswd,
                fullName: fullName,
                avatarUrl: null,
                isActive: true,
                group: null,
                role: {
                    connect: { title: "student" }
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
            where: {email: email}
        });

        if (!user || !await bcrypt.compare(password, user.passwordHash)){
            throw new Error("Неправильный логин или пароль!");
        }

        const payload = {
            id: user.id,
            email: user.email
        }

        const token = generatedRememberToken(payload);

        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }

        }


    }

}


module.exports = new AuthService();