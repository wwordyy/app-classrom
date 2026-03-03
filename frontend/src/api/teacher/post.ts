

import { type CreatePostPayload} from '../../components/teacher/post/types'


export async function apiCreatePost(data: CreatePostPayload) {

    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('groupId', String(data.groupId));
    formData.append('typePostId', String(data.typePostId));

    if (data.dueDate) {
        formData.append('dueDate', data.dueDate);
    }

    if (data.maxScore !== undefined) {
        formData.append('maxScore', String(data.maxScore));
    }

    if (data.weeks) {
        formData.append('weeks', data.weeks);
    }

    if (data.file) {
        formData.append('file', data.file);
    }

    const response = await fetch("/api/teacher/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error ?? "Ошибка создания поста");
    }

    return result;
}



export async function apiGetTypePosts() {

    const response = await fetch("/api/teacher/type-posts", {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Ошибка загрузки типов");
    }

    return data;

}




