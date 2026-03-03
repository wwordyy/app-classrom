import { useEffect, useState } from "react";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";
import { apiCreatePost, apiGetTypePosts } from "../../../api/teacher/post";
import { apiGetTeacherDashboard } from '../../../api/teacher/teacher';
import { type TypePost } from './types';

const POST_TYPES = {
    TASK: 'Задание',
    METHODICAL: 'Методический материал',
    FINAL: 'Итоговая практика',
    DIARY: 'Дневник практики',
};

export function TeacherCreatePostPage() {

    const [groupId, setGroupId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [maxScore, setMaxScore] = useState(5);
    const [typePostId, setTypePostId] = useState<number | null>(null);
    const [typePosts, setTypePosts] = useState<TypePost[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const [weeks, setWeeks] = useState([{ week: 1, goal: "" }]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const today = new Date().toISOString().split("T")[0];

    const selectedType = typePosts.find(t => t.id === typePostId);

    useEffect(() => {
        async function init() {
            try {
                const groups = await apiGetTeacherDashboard();
                if (groups.length === 0) {
                    setError("Группа не найдена");
                    return;
                }

                setGroupId(groups[0].id);

                const types = await apiGetTypePosts();
                setTypePosts(types);
                if (types.length > 0) setTypePostId(types[0].id);

            } catch (e: any) {
                setError(e.message);
            }
        }
        init();
    }, []);

    function handleWeekChange(index: number, value: string) {
        const updated = [...weeks];
        updated[index].goal = value;
        setWeeks(updated);
    }

    function addWeek() {
        if (weeks.length >= 4) return;
        setWeeks([...weeks, { week: weeks.length + 1, goal: "" }]);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!typePostId || !groupId) {
            setError("Выберите тип поста");
            return;
        }

        try {
            setLoading(true);

            await apiCreatePost({
                title,
                content,
                dueDate,
                maxScore,
                groupId,
                typePostId,
                file,
                weeks: selectedType?.title === POST_TYPES.DIARY
                    ? JSON.stringify(weeks)
                    : undefined
            });

            setSuccess(true);
            setTitle("");
            setContent("");
            setDueDate("");
            setMaxScore(5);
            setFile(null);
            setWeeks([{ week: 1, goal: "" }]);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <TeacherAside />

            <main className="flex-1 p-8">
                <DashboardHeader namePage="Создание поста" />

                <div className="bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Новый пост</h2>

                    {error && <div className="mb-4 text-red-500">{error}</div>}
                    {success && <div className="mb-4 text-green-600">Пост успешно создан</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block mb-1 font-medium">Тип поста</label>
                            <select
                                className="w-full bg-stone-100 rounded-lg p-2 px-4 focus:outline-none focus:bg-stone-200 transition"
                                value={typePostId ?? ""}
                                onChange={(e) => setTypePostId(Number(e.target.value))}
                                required
                            >
                                {typePosts.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Название</label>
                            <input
                                className="w-full bg-stone-100 rounded-lg p-2 px-4  transition focus:outline-none focus:bg-stone-200"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Введите название поста..."
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Описание</label>
                            <textarea
                                className="w-full bg-stone-100 rounded-lg p-2 h-28 px-4 focus:outline-none focus:bg-stone-200 transition"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                placeholder="Описание поста...."
                            />
                        </div>

                        {(selectedType?.title === POST_TYPES.TASK ||
                          selectedType?.title === POST_TYPES.FINAL) && (
                            <>
                                <div>
                                    <label className="block mb-1 font-medium">Дата сдачи</label>
                                    <input
                                        type="date"
                                        min={today}
                                        className="w-full bg-stone-100 rounded-lg p-2 px-4 focus:outline-none focus:bg-stone-200"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Максимальный балл</label>
                                    <select
                                        className="w-full bg-stone-100 rounded-lg p-2 px-4 focus:outline-none focus:bg-stone-200"
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(Number(e.target.value))}
                                    >
                                        {[1,2,3,4,5].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {selectedType?.title === POST_TYPES.DIARY && (
                            <div className="space-y-1">
                                <p className="font-medium">План по неделям</p>

                                {weeks.map((w, i) => (
                                    <textarea
                                        key={i}
                                        placeholder={`Цель ${w.week} недели`}
                                        className="w-full bg-stone-100 rounded-lg p-2 px-4 focus:outline-none focus:bg-stone-200"
                                        value={w.goal}
                                        onChange={(e) => handleWeekChange(i, e.target.value)}
                                        required
                                    />
                                ))}

                                {weeks.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={addWeek}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        + Добавить неделю
                                    </button>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block mb-1 font-medium">
                                Прикрепить файл
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer w-full bg-stone-100 rounded-lg p-2 focus:outline-none focus:bg-stone-200 transition">
                                <span className="px-4">
                                    {file ? file.name : "Выберите файл"}
                                </span>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-stone-400 text-white py-2 rounded-lg hover:bg-stone-700 transition disabled:bg-gray-400"
                        >
                            {loading ? "Создание..." : "Создать пост"}
                        </button>

                    </form>
                </div>
            </main>
        </div>
    );
}