const postService = require('../../services/teacher/postService');

class PostController {

    async createPost(req, res) {

        try {

            const fileUrl = req.file ? `/uploads/posts/${req.file.filename}` : null;
            const post = await postService.createPost(req.user.id, req.body, fileUrl);

            return res.status(201).json(post);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async updatePost(req, res) {

        try {

            const post = await postService.updatePost(
                Number(req.params.postId),
                req.user.id,
                req.body
            );
            return res.json(post);

        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getTypePosts(req, res) {

        try {

            return res.json(await postService.getTypePosts());
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getPostSubmissions(req, res) {

        try {
            
            const postId = Number(req.params.postId);
            if (!postId) return res.status(400).json({ error: 'PostId не указан' });
            return res.json(await postService.getPostSubmissions(postId));
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new PostController();