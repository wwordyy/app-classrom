

import { type PracticeInfo } from '../../components/student/practice/types';


export async function apiGetPracticeInfo(): Promise<PracticeInfo> {

    const res = await fetch('/api/student/practice', { credentials: 'include' });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');
    return data;
}