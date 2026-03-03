import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../header";
import { StudentAside } from "../studentAside";
import {
    apiGetPostById,
    apiSubmitPost,
    apiSubmitFinalPost
} from "../../../api/student/post";
import { apiGetMe } from '../../../api/user';
import { type StudentPost } from "./types";
import { PostComments } from '../../shared/postComment/postComment';

const TYPE_METHODICAL = "Методический материал";
const TYPE_DIARY = "Дневник практики";
const FINAL_FILE_LABELS = ["Титульный лист", "Дневник практики", "Отчёт"];

function StatusBadge({ title }: { title: string }) {
    const styles: Record<string, string> = {
        "Не отправлено": "bg-gray-100 text-gray-500",
        "На проверке":   "bg-blue-100 text-blue-600",
        "Проверено":     "bg-green-100 text-green-600",
    };
    return (
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[title] ?? "bg-gray-100 text-gray-500"}`}>
            {title}
        </span>
    );
}

function TeacherFile({ fileUrl }: { fileUrl: string }) {
    const name = fileUrl.split("/").pop() ?? "файл";
    return (
        <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm text-gray-700 transition"
        >
            {name}
        </a>
    );
}

function SingleFileUpload({ onSubmit, loading, submitted }: {
    onSubmit: (file: File) => void;
    loading: boolean;
    submitted: boolean;
}) {
    const [file, setFile] = useState<File | null>(null);
    return (
        <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer w-full bg-stone-100 rounded-lg p-3 hover:bg-stone-200 transition">
                <span className="text-sm text-gray-600">{file ? file.name : "Выберите файл"}</span>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <button
                disabled={!file || loading || submitted}
                onClick={() => file && onSubmit(file)}
                className="w-full bg-stone-900 text-white py-2 rounded-lg hover:bg-stone-700 transition disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
                {loading ? "Отправка..." : submitted ? "Отправлено" : "Сдать задание"}
            </button>
        </div>
    );
}

function MultiFileUpload({ onSubmit, loading, submitted }: {
    onSubmit: (files: File[]) => void;
    loading: boolean;
    submitted: boolean;
}) {
    const [files, setFiles] = useState<(File | null)[]>([null, null, null]);

    const handleChange = (index: number, file: File | null) => {
        setFiles(prev => prev.map((f, i) => (i === index ? file : f)));
    };

    const allSelected = files.every(Boolean);
    const selectedFiles = files.filter(Boolean) as File[];

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-3">Все 3 файла обязательны для сдачи:</p>
            {FINAL_FILE_LABELS.map((label, i) => {
                const hasNew = !!files[i];
                return (
                    <div key={i} className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {i + 1}. {label}
                            <span className="text-red-400 ml-1">*</span>
                        </p>
                        <label className={`flex items-center gap-3 cursor-pointer w-full rounded-lg p-3 transition border ${
                            hasNew
                                ? "bg-green-50 border-green-200 hover:bg-green-100"
                                : "bg-stone-100 border-transparent hover:bg-stone-200"
                        }`}>
                            <span className="text-sm text-stone-600 flex-1 truncate">
                                {hasNew ? files[i]!.name : "Выберите файл"}
                            </span>
                            {hasNew && (
                                <span
                                    className="text-xs text-red-400 hover:text-red-600 cursor-pointer z-10"
                                    onClick={(e) => { e.preventDefault(); handleChange(i, null); }}
                                >
                                    ✕
                                </span>
                            )}
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => handleChange(i, e.target.files?.[0] ?? null)}
                            />
                        </label>
                    </div>
                );
            })}
            {!allSelected && (
                <p className="text-xs text-amber-600">Прикрепите все 3 файла чтобы сдать задание</p>
            )}
            <button
                disabled={!allSelected || loading || submitted}
                onClick={() => onSubmit(selectedFiles)}
                className="w-full bg-stone-800 text-white py-2 rounded-lg hover:bg-stone-700 transition disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
                {loading ? "Отправка..." : submitted ? "Отправлено" : "Сдать итоговую практику"}
            </button>
        </div>
    );
}

export function StudentPostDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [post, setPost]                   = useState<StudentPost | null>(null);
    const [error, setError]                 = useState<string | null>(null);
    const [loading, setLoading]             = useState(false);
    const [submitted, setSubmitted]         = useState(false);

    useEffect(() => {
        apiGetMe().then(me => setCurrentUserId(me.id));
        if (!postId) return;
        apiGetPostById(Number(postId))
            .then(setPost)
            .catch((e) => setError(e.message));
    }, [postId]);

    const isMethodical    = post?.typePost?.title === TYPE_METHODICAL;
    const isDiary         = post?.typePost?.title === TYPE_DIARY;
    const alreadySubmitted = !!post?.submission?.submittedAt;

    const handleSubmit = async (file: File) => {
        if (!post) return;
        setLoading(true);
        try {
            await apiSubmitPost(post.id, file);
            setSubmitted(true);
            const updated = await apiGetPostById(post.id);
            setPost(updated);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitFinal = async (files: File[]) => {
        if (!post) return;
        setLoading(true);
        try {
            await apiSubmitFinalPost(post.id, files);
            setSubmitted(true);
            const updated = await apiGetPostById(post.id);
            setPost(updated);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) return <p className="p-8 text-red-500">{error}</p>;
    if (!post)  return <p className="p-8 text-gray-400">Загрузка...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StudentAside />
            <main className="flex-1 p-8">
                <DashboardHeader namePage="Задание" />
                <button
                    onClick={() => navigate("/student/posts")}
                    className="mb-4 text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
                >
                    Назад к заданиям
                </button>

                <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

                    {/* --- Заголовок и статус --- */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {post.typePost?.title ?? "—"}
                                </span>
                                {post.isFinal && (
                                    <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                                        Итоговая практика
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
                            {!isMethodical && !isDiary && (
                                <p className="text-sm text-gray-400 mt-1">
                                    {post.dueDate && `Сдать до: ${new Date(post.dueDate).toLocaleDateString("ru-RU")}`}
                                    {post.maxScore && ` · Макс. балл: ${post.maxScore}`}
                                </p>
                            )}
                        </div>
                        {!isMethodical && !isDiary && post.submission && (
                            <StatusBadge title={post.submission.statusSubmission.title ?? "Не отправлено"} />
                        )}
                    </div>

                    {/* --- Описание --- */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Описание</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* --- Файл преподавателя --- */}
                    {post.fileUrl && (
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Материал</h2>
                            <TeacherFile fileUrl={post.fileUrl} />
                        </div>
                    )}

                    {/* --- Оценка --- */}
                    {post.submission?.grade != null && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                            <p className="text-sm font-semibold text-green-700 mb-1">Оценка</p>
                            <p className="text-3xl font-bold text-green-600">
                                {post.submission.grade}
                                <span className="text-sm text-gray-400 font-normal"> / {post.maxScore}</span>
                            </p>
                            {post.submission.feedBackTeacher && (
                                <p className="mt-2 text-sm text-gray-600 italic">{post.submission.feedBackTeacher}</p>
                            )}
                        </div>
                    )}

                    {/* --- Итоговая практика: объединённый PDF --- */}
                    {post.isFinal && post.submission?.fileUrl && (
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Итоговый документ
                            </h2>
                            <a
                                href={post.submission.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg text-sm text-green-700 transition"
                            >
                                📄 Скачать объединённый PDF
                            </a>
                        </div>
                    )}

                    {/* --- Дневник практики --- */}
                    {isDiary && post.weeks && (
                        <div className="border-t pt-4">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                План по неделям
                            </h2>
                            <ul className="space-y-2">
                                {post.weeks.map((item: { week: number; goal: string }, i: number) => (
                                    <li key={i} className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-400 mb-1">Неделя {item.week}</p>
                                        <p className="text-gray-700">{item.goal}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* --- Сдача задания / итоговой практики --- */}
                    {!isMethodical && !isDiary && (
                        <div className="border-t pt-6">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                {alreadySubmitted ? "Переотправить задание" : "Сдать задание"}
                            </h2>

                            {alreadySubmitted && !post.submission?.grade && (
                                <p className="text-xs text-blue-500 mb-3">
                                    Вы уже отправили задание. Можно отправить повторно — файл заменится.
                                </p>
                            )}

                            {post.submission?.grade != null ? (
                                <p className="text-sm text-gray-400">
                                    Задание проверено, повторная сдача недоступна.
                                </p>
                            ) : post.isFinal ? (
                                <MultiFileUpload
                                    onSubmit={handleSubmitFinal}
                                    loading={loading}
                                    submitted={submitted}
                                />
                            ) : (
                                <SingleFileUpload
                                    onSubmit={handleSubmit}
                                    loading={loading}
                                    submitted={submitted}
                                />
                            )}
                        </div>
                    )}

                    {/* --- Методический материал --- */}
                    {isMethodical && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-400 text-center">
                                Это методический материал — сдача не требуется.
                            </p>
                        </div>
                    )}

                    {/* --- Комментарии --- */}
                    {currentUserId && (
                        <PostComments
                            postId={post.id}
                            currentUserId={currentUserId}
                            role="student"
                        />
                    )}
                </div>
            </main>
        </div>
    );
}