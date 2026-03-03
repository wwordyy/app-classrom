const postCommentService = require('../../services/shared/postCommentService');

class PostCommentController {

    async getComments(req, res) {

        try {
            const comments = await postCommentService.getComments(
                Number(req.params.postId),
                req.user.id
            );
            return res.json(comments);
        } catch (e) {
            const status = e.message === 'Пост не найден' ? 404
                : e.message === 'Нет доступа' ? 403
                : 400;
            return res.status(status).json({ error: e.message });
        }
        
    }

    async createComment(req, res) {
        try {

            const comment = await postCommentService.createComment(
                Number(req.params.postId),
                req.user.id,
                req.body.content
            );

            return res.status(201).json(comment);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async replyComment(req, res) {
        try {

            const reply = await postCommentService.replyComment(
                Number(req.params.postId),
                Number(req.params.commentId),
                req.user.id,
                req.body.content
            );

            return res.status(201).json(reply);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async deleteComment(req, res) {
        try {

            const result = await postCommentService.deleteComment(
                Number(req.params.commentId),
                req.user.id
            );
            return res.json(result);

        } catch (e) {
            const status = e.message === 'Комментарий не найден' ? 404 : 400;
            return res.status(status).json({ error: e.message });
        }
    }
}

module.exports = new PostCommentController();