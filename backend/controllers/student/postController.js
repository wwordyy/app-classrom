const studentPostService = require('../../services/student/postService');

class StudentPostController {

    async getPosts(req, res) {
        try {

            const posts = await studentPostService.getPosts(req.user.id);
            return res.json(posts);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getPostById(req, res) {
        try {

            const post = await studentPostService.getPostById(
                Number(req.params.postId),
                req.user.id
            );
            return res.json(post);
        } catch (e) {
            const status = e.message === 'Пост не найден' ? 404
                : e.message === 'Нет доступа к этому посту' ? 403 : 400;
            return res.status(status).json({ error: e.message });
        }
    }

    async submitPost(req, res) {
        try {
            
            const fileUrl = req.file ? `/uploads/posts/${req.file.filename}` : null;
            const submission = await studentPostService.submitPost(
                Number(req.params.postId),
                req.user.id,
                fileUrl
            );
            return res.json(submission);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async submitFinalPost(req, res) {
        try {

            const filePaths = req.files?.map(f => `/uploads/posts/${f.filename}`) ?? [];

            const result = await studentPostService.submitFinalPost(
                Number(req.params.postId),
                req.user.id,
                filePaths
            );
            return res.json(result);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new StudentPostController();