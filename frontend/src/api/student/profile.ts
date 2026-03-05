export interface StudentProfile {
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
        teacher: {
            id: number;
            fullName: string;
            email: string;
            avatarUrl: string | null;
        } | null;
    } | null;
    teacher: {
        id: number;
        fullName: string;
        email: string;
        avatarUrl: string | null;
    } | null;
    practiceResult: {
        grade: number;
        comment: string | null;
        gradedAt: string;
        teacher: { fullName: string };
    } | null;
    stats: {
        total: number;
        submitted: number;
        graded: number;
        avgGrade: string | null;
    };
}

export async function apiGetStudentProfile(): Promise<StudentProfile> {
    const res = await fetch('/api/student/profile', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки профиля');
    return data;
}

export async function apiCreateChatWithTeacher() {
    const res = await fetch('/api/student/chat/teacher', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка создания чата');
    return data;
}

export async function apiUploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/me/avatar', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
    return data.avatarUrl;
}