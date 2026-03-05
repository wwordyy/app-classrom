import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../header";
import { StudentAside } from "../studentAside";
import { apiGetStudentProfile, apiCreateChatWithTeacher, type StudentProfile } from "../../../api/student/profile";
import { Avatar } from './avatar';
import { StatCard } from './statCard';

function gradeColor(g: number) {
    if (g <= 2) return "text-red-500";
    if (g === 3) return "text-orange-500";
    if (g === 4) return "text-yellow-500";
    return "text-green-500";
}

export function StudentProfilePage() {
    const [profile, setProfile]         = useState<StudentProfile | null>(null);
    const [error, setError]             = useState<string | null>(null);
    const [chatLoading, setChatLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        apiGetStudentProfile()
            .then(setProfile)
            .catch(e => setError(e.message));
    }, []);

    const handleOpenChat = async () => {
        setChatLoading(true);
        try {
            await apiCreateChatWithTeacher();
            navigate("/student/chats");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setChatLoading(false);
        }
    };

    const handleAvatarUploaded = (newUrl: string) => {
        if (!profile) return;
        setProfile({ ...profile, avatarUrl: newUrl });
    };

    if (error) return <p className="p-8 text-red-500">{error}</p>;
    if (!profile) return <p className="p-8 text-gray-400">Загрузка...</p>;

    const { stats, group, teacher, practiceResult } = profile;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StudentAside />
            <main className="flex-1 p-8 space-y-6">
                <DashboardHeader namePage="Профиль" />

                <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
                    <Avatar
                        url={profile.avatarUrl}
                        name={profile.fullName}
                        size="lg"
                        editable={true}
                        onUploaded={handleAvatarUploaded}
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{profile.fullName}</h1>
                        <p className="text-sm text-gray-400 mt-1">{profile.email}</p>
                        <p className="text-xs text-gray-300 mt-0.5">Нажмите на фото чтобы изменить</p>
                        {group && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{group.name}</span>
                                <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{group.specialty}</span>
                                <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{group.courseYear} курс</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <StatCard label="Всего заданий" value={stats.total}     color="text-gray-700" />
                    <StatCard label="Сдано"         value={stats.submitted} color="text-blue-500" />
                    <StatCard label="Проверено"     value={stats.graded}    color="text-green-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {teacher && (
                        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Преподаватель</h2>
                            <div className="flex items-center gap-4">

                                <Avatar url={teacher.avatarUrl} name={teacher.fullName} size="sm" />
                                <div>
                                    <p className="font-semibold text-gray-800">{teacher.fullName}</p>
                                    <p className="text-xs text-gray-400">{teacher.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleOpenChat}
                                disabled={chatLoading}
                                className="w-full py-2 bg-stone-800 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition disabled:bg-gray-300"
                            >
                                {chatLoading ? "Открытие..." : "Написать преподавателю"}
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Итоговая оценка за практику</h2>
                        {practiceResult ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{practiceResult.teacher.fullName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {new Date(practiceResult.gradedAt).toLocaleDateString("ru-RU")}
                                    </p>
                                    {practiceResult.comment && (
                                        <p className="mt-2 text-sm text-gray-600 italic bg-gray-50 rounded-lg p-2">
                                             {practiceResult.comment}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-5xl font-bold ${gradeColor(practiceResult.grade)}`}>
                                    {practiceResult.grade}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-gray-400">
                                <span className="text-3xl">🎓</span>
                                <p className="text-sm">Оценка ещё не выставлена</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}