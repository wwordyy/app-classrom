
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
                }
            }
        )

        return data;
    }


}   


module.exports = new GroupService();