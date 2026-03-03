import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../header";
import { StudentAside } from "../studentAside";
import { apiGetMyPosts } from "../../../api/student/post";
import { type StudentPostListItem } from "./types";

const POST_TYPES = {
    TASK: "Задание",
    METHODICAL: "Методический материал",
    FINAL: "Итоговая практика",
    DIARY: "Дневник практики",
};

export function StudentPostsPage() {
    const [posts, setPosts] = useState<StudentPostListItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        apiGetMyPosts()
            .then(setPosts)
            .catch((e) => setError(e.message));
    }, []);

    const getStatusClass = (status: string) => {
        if (status === "Не отправлено") return "text-gray-400";
        if (status === "На проверке") return "text-blue-500";
        if (status === "graded") return "text-green-600";
        return "text-gray-500";
    };

    const getGradeClass = (grade: number | null) => {
        if (!grade) return "text-gray-400";
        if (grade <= 2) return "text-red-600";
        if (grade === 3) return "text-orange-500";
        if (grade === 4) return "text-yellow-600";
        return "text-green-600";
    };

    if (error) return <p className="p-8 text-red-500">{error}</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StudentAside />

            <main className="flex-1 p-8">
                <DashboardHeader namePage="Мои задания" />

                {posts.length === 0 ? (
                    <p className="text-gray-500">Заданий пока нет</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => {
                            const typeTitle = post.typePost?.title ?? "";
                            const isViewOnly =
                                typeTitle === POST_TYPES.METHODICAL ||
                                typeTitle === POST_TYPES.DIARY;

                            const showDeadline =
                                typeTitle === POST_TYPES.TASK ||
                                typeTitle === POST_TYPES.FINAL;

                            const showMaxScore =
                                typeTitle === POST_TYPES.TASK ||
                                typeTitle === POST_TYPES.FINAL;

                            return (
                                <div
                                    key={post.id}
                                    onClick={() => navigate(`/student/posts/${post.id}`)}
                                    className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition animation-card"
                                >
                                 <div className="flex-1">
                                        <p className="font-semibold">{post.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {typeTitle}
                                            {showDeadline && post.dueDate && (
                                                <> · Сдать до: {new Date(post.dueDate).toLocaleDateString()}</>
                                            )}
                                        </p>
                                    </div>

                                    {!isViewOnly && (
                                        <div className="mt-2 sm:mt-0 flex items-center gap-6">
                                            <span
                                                className={`text-sm ${getStatusClass(
                                                    post.submission?.statusSubmission.title ?? "Не отправлено"
                                                )}`}
                                            >
                                                {post.submission?.statusSubmission.title ?? "Не отправлено"}
                                            </span>
                                            {showMaxScore && (
                                                <span
                                                    className={`font-bold text-lg ${getGradeClass(
                                                        post.submission?.grade ?? null
                                                    )}`}
                                                >
                                                    {post.submission?.grade ?? "-"}
                                                    <span className="text-sm text-gray-400">
                                                        /{post.maxScore}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {typeTitle === POST_TYPES.DIARY && (
                                        <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                                            {/* Здесь можно отобразить количество недель или preview целей */}
                                            {post.weeks
                                                ? `План на ${post.weeks.length} ${post.weeks.length === 1 ? "неделю" : "недели"}`
                                                : ""}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}