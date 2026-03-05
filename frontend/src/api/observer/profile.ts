


export interface ObserverProfile {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    stats: {
        totalChats: number;
        totalMessages: number;
    };
}

export async function apiGetObserverProfile(): Promise<ObserverProfile> {

    const res = await fetch('/api/observer/profile', { credentials: 'include' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки профиля');
    return data;
}