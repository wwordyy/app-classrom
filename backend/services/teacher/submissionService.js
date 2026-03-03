

const prisma = require ('../../prisma/client');


class SubmissionService {

    async updateSubmission (id, grade, feedBackTeacher) {

        const gradedStatus = await prisma.statusSubmission.findFirst({
            where: { title: "graded" }
        });

        await prisma.submission.update({
            where: {
                id: Number(id),
            },
            data: {
                grade: Number(grade),
                feedBackTeacher: feedBackTeacher,
                ...(grade && gradedStatus ? { statusSubmissionId: gradedStatus.id } : {})
            }
        });

        return { ok: true };

    }

}

module.exports = new SubmissionService();