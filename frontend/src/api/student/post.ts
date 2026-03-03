

import { type StudentPost, type StudentPostListItem } from '../../components/student/post/types';




export async function apiGetMyPosts(): Promise<StudentPostListItem[]> {

    const res = await fetch('/api/student/posts', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
    return data;
}

export async function apiGetPostById(postId: number): Promise<StudentPost> {

    const res = await fetch(`/api/student/posts/${postId}`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
    return data;
}


export async function apiSubmitPost(postId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/student/posts/${postId}/submit`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки');
    return data;
}


export async function apiSubmitFinalPost(postId: number, files: File[]) {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    const res = await fetch(`/api/student/posts/${postId}/submit-final`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки');
    return data;
}