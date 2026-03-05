export interface TeacherProfile {
    id: number;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    group: {
        id: number;
        name: string;
        specialty: string;
        courseYear: number;
        students: { id: number; fullName: string; avatarUrl: string | null }[];
    } | null;
    stats: {
        totalStudents: number;
        totalPosts: number;
        gradedSubmissions: number;
    };
}

export async function apiGetTeacherProfile(): Promise<TeacherProfile> {

    const res = await fetch('/api/teacher/profile', { credentials: 'include' });
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки профиля');
    return data;
}