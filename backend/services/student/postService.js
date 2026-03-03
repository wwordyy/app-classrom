const prisma = require('../../prisma/client');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const TYPE_METHODICAL = 'Методический материал';

class StudentPostService {

    async getPosts(userId) {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { groupId: true },
        });

        if (!user?.groupId) throw new Error('Студент не привязан к группе');

        const posts = await prisma.post.findMany({
            where: { groupId: user.groupId },
            include: {
                typePost: true,
                submissions: {
                    where: { userId: Number(userId) },
                    select: {
                        id: true,
                        grade: true,
                        submittedAt: true,
                        feedBackTeacher: true,
                        statusSubmission: { select: { id: true, title: true } },
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });

        return posts.map(post => ({
            ...post,
            submission: post.submissions[0] ?? null,
        }));
    }

    async getPostById(postId, userId) {
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
            include: {
                typePost: true,
                submissions: {
                    where: { userId: Number(userId) },
                    include: {
                        statusSubmission: { select: { id: true, title: true } },
                    },
                },
            },
        });

        console.log('submission:', post.submissions[0]);

        if (!post) throw new Error('Пост не найден');

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { groupId: true },
        });

        if (user?.groupId !== post.groupId) throw new Error('Нет доступа к этому посту');

        let documentParts = [];
        if (post.isFinal) {
            documentParts = await prisma.documentPart.findMany({
                where: { groupId: post.groupId, userId: Number(userId) },
                include: { documentType: true },
                orderBy: { documentType: { orderIndex: 'asc' } },
            });
        }

        return {
            ...post,
            submission: post.submissions[0] ?? null,
            documentParts,
        };
    }

    async submitPost(postId, userId, fileUrl = null) {
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
            include: { typePost: true },
        });

        if (!post) throw new Error('Пост не найден');
        if (post.typePost?.title === TYPE_METHODICAL) throw new Error('Методический материал не требует сдачи');
        if (post.isFinal) throw new Error('Итоговый пост сдаётся через отдельный эндпоинт');

        let submission = await prisma.submission.findFirst({
            where: { postId: Number(postId), userId: Number(userId) },
        });

        if (!submission) {
            submission = await prisma.submission.create({
                data: { postId: Number(postId), userId: Number(userId), statusSubmissionId: 1 },
            });
        }

        return prisma.submission.update({
            where: { id: submission.id },
            data: { fileUrl, submittedAt: new Date(), statusSubmissionId: 2 },
            include: { statusSubmission: { select: { id: true, title: true } } },
        });
    }

    async submitFinalPost(postId, userId, filePaths) {
        const post = await prisma.post.findUnique({ where: { id: Number(postId) } });

        if (!post) throw new Error('Пост не найден');
        if (!post.isFinal) throw new Error('Это не итоговый пост');
        if (!filePaths || filePaths.length === 0) throw new Error('Необходимо прикрепить файлы');
        if (filePaths.length > 3) throw new Error('Можно прикрепить не более 3 файлов');



        const mergedPdf = await PDFDocument.create();

        for (const fileUrl of filePaths) {
            const absolutePath = path.join(process.cwd(), fileUrl);

            if (!fs.existsSync(absolutePath)) {
                throw new Error(`Файл не найден: ${fileUrl}`);
            }

            const bytes = fs.readFileSync(absolutePath);
            let srcDoc;
            try {
                srcDoc = await PDFDocument.load(bytes);
            } catch {
                throw new Error('Один из файлов не является валидным PDF');
            }

            const pageCount = srcDoc.getPageCount();
            const pages = await mergedPdf.copyPages(srcDoc, [...Array(pageCount).keys()]);
            pages.forEach(p => mergedPdf.addPage(p));
        }


        const mergedBytes = await mergedPdf.save();
        const mergedName  = `merged-${userId}-${Date.now()}.pdf`;
        const mergedDir   = path.join(process.cwd(), 'uploads', 'merged');
        const mergedPath  = path.join(mergedDir, mergedName);
        const mergedUrl   = `/uploads/merged/${mergedName}`;

        if (!fs.existsSync(mergedDir)) fs.mkdirSync(mergedDir, { recursive: true });
        fs.writeFileSync(mergedPath, mergedBytes);


        const documentTypes = await prisma.documentType.findMany({
            orderBy: { orderIndex: 'asc' },
            take: 3,
        });
        if (documentTypes.length === 0) throw new Error('Типы документов не настроены');

        await prisma.documentPart.deleteMany({
            where: { groupId: post.groupId, userId: Number(userId) },
        });

        await prisma.documentPart.createMany({
            data: filePaths.map((fileUrl, index) => ({
                fileUrl,
                groupId: post.groupId,
                userId: Number(userId),
                documentTypeId: documentTypes[index]?.id ?? documentTypes[0].id,
            })),
        });


        let submission = await prisma.submission.findFirst({
            where: { postId: Number(postId), userId: Number(userId) },
        });

        if (!submission) {
            submission = await prisma.submission.create({
                data: { postId: Number(postId), userId: Number(userId), statusSubmissionId: 1 },
            });
        }

        await prisma.submission.update({
            where: { id: submission.id },
            data: { fileUrl: mergedUrl, submittedAt: new Date(), statusSubmissionId: 2 },
        });


        for (const fileUrl of filePaths) {
            const abs = path.join(process.cwd(), fileUrl);
            if (fs.existsSync(abs)) fs.unlinkSync(abs);
        }

        return { mergedUrl };
    }
}

module.exports = new StudentPostService();