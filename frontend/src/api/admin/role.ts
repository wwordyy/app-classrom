


import type { Role, ResponseError } from '../../components/admin/types';

export async function apiAdminGetRoles(): Promise<Role[]> {

    const res = await fetch('/api/roles', { credentials: 'include' });

    const data: Role[] | ResponseError = await res.json();

    if (!res.ok) throw new Error((data as ResponseError).error || 'Ошибка загрузки ролей');
    return data as Role[];
}