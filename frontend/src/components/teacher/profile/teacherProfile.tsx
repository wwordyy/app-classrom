

import { useEffect, useState } from "react";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";
import { apiGetTeacherProfile, type TeacherProfile } from "../../../api/teacher/profile";
import { AvatarUpload, Avatar } from './avatar'
import { StatCard } from './statCard'


export function TeacherProfilePage() {
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        apiGetTeacherProfile()
            .then(setProfile)
            .catch(e => setError(e.message));
    }, []);

    const handleAvatarUploaded = (newUrl: string) => {
        if (!profile) return;
        setProfile({ ...profile, avatarUrl: newUrl });
    };

    if (error)   return <p className="p-8 text-red-500">{error}</p>;
    if (!profile) return <p className="p-8 text-gray-400">Загрузка...</p>;

    const { stats, group } = profile;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <TeacherAside />
            <main className="flex-1 p-8 space-y-6">
                <DashboardHeader namePage="Профиль" />

                {/* Карточка профиля */}
                <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
                    <AvatarUpload
                        url={profile.avatarUrl}
                        name={profile.fullName}
                        onUploaded={handleAvatarUploaded}
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{profile.fullName}</h1>
                        <p className="text-sm text-gray-400 mt-1">{profile.email}</p>
                        {group && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{group.name}</span>
                                <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{group.specialty}</span>
                                <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{group.courseYear} курс</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Студентов в группе" value={stats.totalStudents}     color="text-blue-500" />
                    <StatCard label="Заданий создано"    value={stats.totalPosts}        color="text-gray-700" />
                    <StatCard label="Работ проверено"    value={stats.gradedSubmissions} color="text-green-500" />
                </div>

                {group && group.students.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Студенты группы {group.name}
                        </h2>
                        <div className="space-y-3">
                            {group.students.map(student => (
                                <div key={student.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                                    <Avatar url={student.avatarUrl} name={student.fullName} />
                                    <span className="text-sm font-medium text-gray-700">{student.fullName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}