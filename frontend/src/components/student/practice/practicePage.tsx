import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../header";
import { StudentAside } from "../studentAside";
import { apiGetPracticeInfo } from "../../../api/student/practice";
import { type PracticeInfo, type PracticePost } from "./types";
import { DeadlineCalendar } from './calendar'


function getGradeColor(grade: number | null) {
    if (!grade) return "text-gray-400";
    if (grade <= 2) return "text-red-500";
    if (grade === 3) return "text-orange-500";
    if (grade === 4) return "text-yellow-500";
    return "text-green-500";
}

function getStatusColor(status: string) {
    if (status === "Не сдано") return "bg-gray-100 text-gray-500";
    if (status === "submitted" || status === "На проверке") return "bg-blue-100 text-blue-600";
    if (status === "Проверено") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-500";
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
}

function PracticeResultBlock({ result }: { result: PracticeInfo["practiceResult"] }) {
    if (!result) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 border-2 border-dashed border-gray-200">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                    🎓
                </div>
                <div>
                    <p className="font-semibold text-gray-700">Итоговая оценка за практику</p>
                    <p className="text-sm text-gray-400 mt-0.5">Оценка ещё не выставлена</p>
                </div>
            </div>
        );
    }

    const gradeColors: Record<number, string> = {
        2: "bg-red-50 border-red-200",
        3: "bg-orange-50 border-orange-200",
        4: "bg-yellow-50 border-yellow-200",
        5: "bg-green-50 border-green-200",
    };

    return (
        <div className={`rounded-2xl shadow-md p-6 border-2 ${gradeColors[result.grade] ?? "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Итоговая оценка за практику
                    </p>
                    <p className="text-sm text-gray-500">
                        Преподаватель: {result.teacher}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Выставлена: {formatDate(result.gradedAt)}
                    </p>
                    {result.comment && (
                        <p className="mt-3 text-sm text-gray-600 italic bg-white/60 rounded-lg p-3">
                            💬 {result.comment}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <span className={`text-6xl font-bold ${getGradeColor(result.grade)}`}>
                        {result.grade}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">из 5</p>
                </div>
            </div>
        </div>
    );
}


function PostsList({ posts }: { posts: PracticePost[] }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Задания
            </h2>
            {posts.length === 0 ? (
                <p className="text-gray-400 text-sm">Заданий пока нет</p>
            ) : (
                <div className="space-y-3">
                    {posts.map(post => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/student/posts/${post.id}`)}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {post.typePost} · до {formatDate(post.dueDate)}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(post.status)}`}>
                                    {post.status}
                                </span>
                                <span className={`text-sm font-bold ${getGradeColor(post.grade)}`}>
                                    {post.grade ?? "—"}
                                    <span className="text-xs text-gray-400 font-normal">/{post.maxScore}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function StudentPracticePage() {
    const [data, setData]   = useState<PracticeInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiGetPracticeInfo()
            .then(setData)
            .catch(e => setError(e.message));
    }, []);

    if (error) return <p className="p-8 text-red-500">{error}</p>;
    if (!data)  return <p className="p-8 text-gray-400">Загрузка...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StudentAside />

            <main className="flex-1 p-8 space-y-6">
                <DashboardHeader namePage="Практика" />

                <PracticeResultBlock result={data.practiceResult} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DeadlineCalendar posts={data.posts} />
                    <PostsList posts={data.posts} />
                </div>
            </main>
        </div>
    );
}