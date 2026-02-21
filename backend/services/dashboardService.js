

const prisma = require('../prisma/client')


class DashboardService {
    

    async getOverview() {
        const totalGroups = await prisma.group.count();
        const totalTeachers = await prisma.user.count({
            where: {role: {title: "teacher"}}
        });
        const totalStudents = await prisma.user.count({
            where: {role: {title: "student"}}
        })
        


        return {
            totalGroups,
            totalTeachers,
            totalStudents
        }
    }


    async getGroupsSubmissionsSubmitted() {

        const groups = await prisma.group.findMany({
            select: {
                id: true, 
                name: true,
                users: {
                    where: {
                        role: { title: "student" }
                    },
                    select: {
                        id: true,
                        submissions: {
                            include: {
                                statusSubmission: true
                            }
                        }
                    }
                }
            }
        })

        const result = groups.map(group => {

            let total = 0
            let submitted = 0

            group.users.forEach(user => {
                user.submissions.forEach(sub => {
                    total++;
                    if (sub.statusSubmission.title === "submitted"){
                        submitted++;
                    }

                })
            });
            
            const percent = total === 0 ? 0 : Math.round((submitted / total) * 100);

            return {
                groupId: group.id,
                groupName: group.name,
                percent
            };
        })

        return result

    }



    async getSubmissionStats() {

        const posts = await prisma.post.findMany({
            select: {
                id: true,
                dueDate: true,
                stream: {
                    select: {
                        groups: {
                            select: {
                                group: {
                                    select: {
                                        users: {
                                            where: {
                                                role: { title: "student" }
                                            },
                                            select: { id: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const submissions = await prisma.submission.findMany({
            select: {
                postId: true,
                userId: true,
                submittedAt: true,
                statusSubmission: {
                    select: { title: true }
                }
            }
        });

        const submissionMap = new Map();

        submissions.forEach(sub => {
            const key = `${sub.postId}_${sub.userId}`;
            submissionMap.set(key, sub);
        });

        let totalExpected = 0;
        let submittedOnTime = 0;
        let late = 0;

        posts.forEach(post => {

            const students = post.stream.groups
                .flatMap(sg => sg.group.users);

            totalExpected += students.length;

            students.forEach(student => {

                const key = `${post.id}_${student.id}`;
                const submission = submissionMap.get(key);

                if (!submission) {
                    late++; 
                    return;
                }

                if (submission.statusSubmission.title !== "submitted") {
                    late++;
                    return;
                }

                if (!submission.submittedAt || submission.submittedAt > post.dueDate) {
                    late++;
                } else {
                    submittedOnTime++;
                }

            });

        });

        const percentSubmitted = totalExpected === 0
            ? 0
            : Math.round((submittedOnTime / totalExpected) * 100);

        const percentLate = totalExpected === 0
            ? 0
            : Math.round((late / totalExpected) * 100);

        return {
            totalExpected,
            submittedOnTime,
            late,
            percentSubmitted,
            percentLate
        };
    }

    
    async getGroupsOverview () {
        const groups = await prisma.group.findMany({
            select: {
                id: true,
                name: true,
                courseYear: true,
                users: {
                    where: { role: {title: "student"} },
                    select: { id: true}
                },
                streams: {
                    select: {
                        stream: {
                            select: {
                                teacher: {
                                    select: {
                                        id: true, 
                                        fullName: true
                                    }
                                }
                            }
                        }
                    }
                }
            }

        });

        return groups.map(group => {

            const teachersMap = new Map();

            group.streams.forEach(sg => {
                const teacher = sg.stream.teacher;
                teachersMap.set(teacher.id, teacher);

            })

            return {
                id: group.id,
                name: group.name,
                courseYear: group.courseYear,
                studentsCount: group.users.length,
                teachers: Array.from(teachersMap.values())

            }

        })

    }

}


module.exports = new DashboardService();