
const prisma = require('../prisma/client');


class GroupService{

    async getGroups () {

        const data = prisma.group.findMany(
            {
                orderBy: {
                    id: 'asc',
                },
                select: {
                    id: true,
                    name: true,
                    courseYear: true,
                    specialty: true,
                    teacher: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        }
                    },
                    _count: {
                        select: {
                            students: true,
                            posts: true,
                        }
                    }
                }
            }
        )

        return data;
    }


}   


module.exports = new GroupService();