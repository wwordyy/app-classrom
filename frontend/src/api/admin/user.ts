import type { User, UserListResponse, ResponseError } from '../../components/admin/types';

const BASE = '/api/admin/users';

    export async function apiAdminGetUsers(params: {
        page?: number;
        limit?: number;
        search?: string;
        roleId?: number;
        }): Promise<UserListResponse> {
        const q = new URLSearchParams();
        if (params.page)   q.set('page',   String(params.page));
        if (params.limit)  q.set('limit',  String(params.limit));
        if (params.search) q.set('search', params.search);
        if (params.roleId) q.set('roleId', String(params.roleId));

        const res = await fetch(`${BASE}?${q}`, { credentials: 'include' });

        const data: UserListResponse | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка загрузки пользователей');

        return data as UserListResponse;
    }

    export async function apiAdminGetUser(id: number): Promise<User> {

        const res = await fetch(`${BASE}/${id}`, { credentials: 'include' });

        const data: User | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка загрузки пользователя');
        return data as User;
    }

    export async function apiAdminCreateUser(body: {
        email: string;
        password: string;
        fullName: string;
        avatarUrl?: string;
        isActive?: boolean;
        roleId: number;
        groupId?: number | null;
        }): Promise<User> {

        const res = await fetch(BASE, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data: User | ResponseError = await res.json();

        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка создания пользователя');
        return data as User;
    }

    export async function apiAdminUpdateUser(
        id: number,
        body: Partial<{
            email: string;
            password: string;
            fullName: string;
            avatarUrl: string;
            isActive: boolean;
            roleId: number;
            groupId: number | null;
        }>
    ): Promise<User> {

        const res = await fetch(`${BASE}/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data: User | ResponseError = await res.json();
        if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка обновления пользователя');
        return data as User;
    }

    export async function apiAdminDeleteUser(id: number): Promise<void> {

        const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', credentials: 'include' });

        if (!res.ok) {
            const data: ResponseError = await res.json();
            throw new Error(data.error || 'Ошибка удаления пользователя');
        }

    }

    export async function apiAdminToggleActive(id: number): Promise<{ id: number; isActive: boolean }> {

        const res = await fetch(`${BASE}/${id}/toggle-active`, { method: 'PATCH', credentials: 'include' });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Ошибка');
        
        return data;
    }