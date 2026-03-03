


const submissionController = require ('../../services/teacher/submissionService');


class SubmissionController {

    async updateSubmission (req, res) {

        try {

            const { id } = req.params;
            const { grade, feedBackTeacher } = req.body;

            const data = await submissionController.updateSubmission(id, grade, feedBackTeacher);

            return res.status(200).json(data);
            
        } catch (e) {
            res.status(400).json({ error: e.message });

        }


    }


}

module.exports = new SubmissionController();