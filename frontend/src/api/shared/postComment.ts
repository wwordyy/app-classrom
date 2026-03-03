import { type PostComment } from '../../components/shared/postComment/types';


export async function apiGetComments(postId: number): Promise<PostComment[]> {

    const res = await fetch(`/api/posts/${postId}/comments`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки комментариев');

    return data;
}

export async function apiCreateComment(postId: number, content: string): Promise<PostComment> {

    const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки');

    return data;
}

export async function apiReplyComment(postId: number, commentId: number, content: string): Promise<PostComment> {

    const res = await fetch(`/api/posts/${postId}/comments/${commentId}/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки');
    return data;
}

export async function apiDeleteComment(commentId: number): Promise<void> {

    const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error ?? 'Ошибка удаления');
}