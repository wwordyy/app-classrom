import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetPostSubmissions } from "../../../api/teacher/submission";
import { type PostWithSubmissions } from "./types";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";

import { UpdSubmissionModal } from './updSubmissionModal'
import { apiUpdSubmission } from '../../../api/teacher/submission'
import { apiGetMe } from '../../../api/user'

import { PostComments } from '../../shared/postComment/postComment'


export function PostSubmissionsPage() {

    const [selectedSubmission, setSelectedSubmission] = useState<PostWithSubmissions["submissions"][number] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostWithSubmissions | null>(null);
    const [ currentUserId, setCurrentUserId ] = useState<number | null> (null); 

    useEffect(() => {

        apiGetMe().then(me => setCurrentUserId(me.id));

        if (!postId) return;
        apiGetPostSubmissions(Number(postId))
            .then(setPost)
            .catch(console.error);

    }, [postId]);


    const handleCardClick = (submission: PostWithSubmissions["submissions"][number]) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };


    const getCardClass = (grade: number | null) => {
        if (!grade) return "bg-white";

        if (grade <= 2) return "bg-red-100";

        if (grade === 3) return "bg-orange-100";

        if (grade === 4) return "bg-yellow-100";
        return "bg-lime-100";
    };

    if (!post) return <p className="p-8">Загрузка...</p>;

    return (
    <div className="flex min-h-screen bg-gray-100">

        <TeacherAside />

        <main className="flex-1 p-8">
        <DashboardHeader namePage={`Пост: ${post.title}`} />

        <p className="mb-6">{post.content}</p>

        {post.fileUrl && (
            <div className="mb-6 flex items-center gap-2 bg-white rounded-lg p-3 shadow w-fit">
                <span>📎</span>
                <a
                    href={post.fileUrl}
                    target="_blank"
                    className="hover:underline text-sm">
                    Скачать прикреплённый файл
                </a>
            </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Заявки студентов</h2>

        {post.submissions.length === 0 ? (
            <p className="text-gray-500">Пока никто не сдал работу</p>
        ) : (
            <div className="space-y-4">
            {post.submissions.map((sub) => (
                <div
                key={sub.id}
                className={`${getCardClass(sub.grade)} shadow rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center animation-card`}
                onClick={() => handleCardClick(sub)}
                >
                <div className="flex-1">
                    <p className="font-semibold">{sub.student.fullName}</p>
                    <p className="text-sm text-gray-600">{sub.student.email}</p>
                </div>

                <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                    Файл:{" "}
                    {sub.fileUrl ? (
                        <a
                        href={sub.fileUrl}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                        >
                        Скачать
                        </a>
                    ) : (
                        "-"
                    )}
                    </div>

                    <div>Оценка: {sub.grade ?? "-"}</div>
                    <div>Статус: {sub.statusSubmission.title}</div>
                    <div>
                    Дата сдачи:{" "}
                    {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleString()
                        : "-"}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}


            { post && currentUserId && (
                <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
                    <PostComments
                        postId={Number(postId)}
                        currentUserId={currentUserId}
                        role="teacher"
                    />
                </div>
            )}

        </main>


        {selectedSubmission && (
            <UpdSubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentName={selectedSubmission.student.fullName}
                currentGrade={selectedSubmission.grade}
                currentComment={selectedSubmission.feedBackTeacher ?? ""}
                onSubmit={(grade, comment) => {
                if (!selectedSubmission) return;

                apiUpdSubmission(selectedSubmission.id, { grade, feedBackTeacher: comment })
                    .then((updated) => {
                    if (post) {
                        setPost({
                        ...post,
                        submissions: post.submissions.map((s) =>
                            s.id === updated.id
                            ? { ...s, grade: updated.grade, feedBackTeacher: updated.feedBackTeacher }
                            : s
                        ),
                        });
                    }
                    })
                    .catch(console.error);

                    window.location.reload();
                }
            

            }
            />
            )}

    </div>
    );
}