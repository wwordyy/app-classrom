

import { useEffect, useState } from "react";
import { DashboardHeader } from "../../header";
import { AsideBlock } from "../aside";
import { apiGetObserverProfile, type ObserverProfile } from "../../../api/observer/profile";
import { StatCard } from './statCard'
import { AvatarUpload } from './avatar' 

export function ObserverProfilePage() {
    const [profile, setProfile] = useState<ObserverProfile | null>(null);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        apiGetObserverProfile()
            .then(setProfile)
            .catch(e => setError(e.message));
    }, []);

    const handleAvatarUploaded = (newUrl: string) => {
        if (!profile) return;
        setProfile({ ...profile, avatarUrl: newUrl });
    };

    if (error)    return <p className="p-8 text-red-500">{error}</p>;
    if (!profile) return <p className="p-8 text-gray-400">Загрузка...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AsideBlock />
            <main className="flex-1 p-8 space-y-6">
                <DashboardHeader namePage="Профиль" />

                <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-6">
                    <AvatarUpload
                        url={profile.avatarUrl}
                        name={profile.fullName}
                        onUploaded={handleAvatarUploaded}
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{profile.fullName}</h1>
                        <p className="text-sm text-gray-400 mt-1">{profile.email}</p>
                        <p className="text-xs text-gray-300 mt-0.5">Нажмите на фото чтобы изменить</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                                Наблюдатель
                            </span>
                            <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                                С {new Date(profile.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Активных чатов"    value={profile.stats.totalChats}    color="text-blue-500" />
                    <StatCard label="Отправлено сообщений" value={profile.stats.totalMessages} color="text-green-500" />
                </div>
            </main>
        </div>
    );
}