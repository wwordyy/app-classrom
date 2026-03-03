import type { GroupItem, GroupDetail, GroupListResponse, ResponseError } from '../../components/admin/types';

const BASE = '/api/admin/groups';

    export async function apiAdminGetGroups(params: {
        page?: number;
        limit?: number;
        search?: string;
        }): Promise<GroupListResponse> {

        const q = new URLSearchParams();
        if (params.page)   q.set('page',   String(params.page));
        if (params.limit)  q.set('limit',  String(params.limit));
        if (params.search) q.set('search', params.search);

        const res = await fetch(`${BASE}?${q}`, { credentials: 'include' });

        const data: GroupListResponse | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка загрузки групп');

        return data as GroupListResponse;
    }

    export async function apiAdminGetGroup(id: number): Promise<GroupDetail> {

        const res = await fetch(`${BASE}/${id}`, { credentials: 'include' });

        const data: GroupDetail | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка загрузки группы');

        return data as GroupDetail;
    }

    export async function apiAdminCreateGroup(body: {
        name: string;
        courseYear: number;
        specialty: string;
        teacherId?: number | null;
        }): Promise<GroupItem> {

        const res = await fetch(BASE, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data: GroupItem | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка создания группы');
        
        return data as GroupItem;
    }

    export async function apiAdminUpdateGroup(
        id: number,
        body: Partial<{
            name: string;
            courseYear: number;
            specialty: string;
            teacherId: number | null;
        }>
        ): Promise<GroupItem> {

        const res = await fetch(`${BASE}/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data: GroupItem | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка обновления группы');

        return data as GroupItem;
    }

    export async function apiAdminDeleteGroup(id: number): Promise<void> {

        const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' });

        if (!res.ok) {
            const data: ResponseError = await res.json();
            throw new Error(data.error || 'Ошибка удаления группы');
        }

    }