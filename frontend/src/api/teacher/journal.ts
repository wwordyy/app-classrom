

export async function apiGetGroupStudents() {

    const res = await fetch('/api/teacher/journal', {
        method: "GET",
        credentials: "include",
    })

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.error ?? "Не удалось получить данные журнала!");
    }

    return result;

    
}

export async function apiGetStudentGrades(studentId: number) {

    const res = await fetch(`/api/teacher/journal/${studentId}`, {
        method: "GET",
        credentials: "include",
    })

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.error ?? "Не удалось оценки студента!");
    }

    return result;
    
}



export async function apiUpsertPracticeResult( groupId: number, studentId: number, grade: number, comment: string) {
    
    const res = await fetch(`/api/teacher/groups/${groupId}/students/${studentId}/practice-result`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, comment }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? 'Ошибка сохранения');
    return data;
}

export async function apiGetPracticeResult(groupId: number, studentId: number) {

    const res = await fetch(`/api/teacher/groups/${groupId}/practice-results`, {
        method: "GET",
        credentials: 'include',
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');

    return data.find((s: any) => s.id === studentId)?.practiceResult ?? null;
}