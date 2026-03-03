

interface payloadUpd {
    grade: number, 
    feedBackTeacher: string
}

export async function apiGetPostSubmissions(postId: number) {

        const res = await fetch(`/api/teacher/posts/${postId}/submissions`, { 
            credentials: "include" 
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Ошибка получения заявок");

        return data;
    
}


export async function apiUpdSubmission(id: number, payload: payloadUpd) {

    const res = await fetch(`/api/teacher/submissions/${id}/grade`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Ошибка обновления заявки");

    return data;
    

}