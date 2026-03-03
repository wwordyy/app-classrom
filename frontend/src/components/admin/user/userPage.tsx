import { useState, useEffect, useCallback } from 'react';
import type { User, Role, GroupItem } from '../../admin/types';
import {
    apiAdminGetUsers, apiAdminCreateUser,
    apiAdminUpdateUser, apiAdminDeleteUser, apiAdminToggleActive,
} from '../../../api/admin/user';
import { apiAdminGetRoles }  from '../../../api/admin/role'
import { apiAdminGetGroups } from '../../../api/admin/group';
import {
    Btn, IconBtn, Field, inputCls, Badge, Avatar, Modal,
    ConfirmDialog, Pagination, AdminPageHeader, SearchInput,
} from '../shared/adminUI';

import { AdminAside } from '../shared/adminAside'


function UserForm({ initial, roles, groups, onSubmit, onClose }: {
    initial?: User; roles: Role[]; groups: GroupItem[];
    onSubmit: (d: Record<string, unknown>) => Promise<void>;
    onClose: () => void;
}) {


    const [form, setForm] = useState({
        fullName:  initial?.fullName  ?? '',
        email:     initial?.email     ?? '',
        password:  '',
        avatarUrl: initial?.avatarUrl ?? '',
        isActive:  initial?.isActive  ?? true,
        roleId:    initial?.role?.id  ? String(initial.role.id)          : '',
        groupId:   initial?.studentGroup?.id ? String(initial.studentGroup.id) : '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {

            const payload: Record<string, unknown> = { ...form };
            if (!payload.password)  delete payload.password;
            if (!payload.avatarUrl) delete payload.avatarUrl;
            payload.roleId  = Number(payload.roleId);
            payload.groupId = payload.groupId ? Number(payload.groupId) : null;
            await onSubmit(payload);
            onClose();
            
        } catch (e: unknown) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Field label="ФИО *">
                <input className={inputCls} value={form.fullName} onChange={set('fullName')} required placeholder="Иванов Иван Иванович" />
            </Field>
            <Field label="Email *">
                <input className={inputCls} type="email" value={form.email} onChange={set('email')} required placeholder="user@edu.ru" />
            </Field>
            <Field label={initial ? 'Новый пароль (пусто — не менять)' : 'Пароль *'}>
                <input className={inputCls} type="password" value={form.password} onChange={set('password')} required={!initial} placeholder="••••••••" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Роль *">
                    <select className={inputCls} value={form.roleId} onChange={set('roleId')} required>
                        <option value="">— выбрать —</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                    </select>
                </Field>
                <Field label="Группа (студент)">
                    <select className={inputCls} value={form.groupId} onChange={set('groupId')}>
                        <option value="">— нет —</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Field label="URL аватара">
                    <input className={inputCls} value={form.avatarUrl} onChange={set('avatarUrl')} placeholder="https://..." />
                </Field>
                <Field label="Статус">
                    <select className={inputCls} value={form.isActive ? '1' : '0'}
                        onChange={e => setForm(f => ({ ...f, isActive: e.target.value === '1' }))}>
                        <option value="1">active</option>
                        <option value="0">inactive</option>
                    </select>
                </Field>
            </div>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <div className="flex gap-2 justify-end mt-2">
                <Btn variant="ghost" onClick={onClose}>Отмена</Btn>
                <Btn type="submit" disabled={loading}>{loading ? '...' : initial ? 'Сохранить' : 'Создать'}</Btn>
            </div>
        </form>
    );
}

type ModalState =
    | { type: 'create' }
    | { type: 'edit';   user: User }
    | { type: 'delete'; user: User }
    | null;

export function AdminUsersPage() {


    const [users,  setUsers]  = useState<User[]>([]);
    const [total,  setTotal]  = useState(0);
    const [page,   setPage]   = useState(1);
    const [search, setSearch] = useState('');
    const [roles,  setRoles]  = useState<Role[]>([]);
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const [modal,  setModal]  = useState<ModalState>(null);
    const LIMIT = 10;

    const load = useCallback(async () => {
        const res = await apiAdminGetUsers({ page, limit: LIMIT, search });
        setUsers(res.data);
        setTotal(res.total);
    }, [page, search]);


    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        apiAdminGetRoles().then(setRoles);
        apiAdminGetGroups({ limit: 1000 }).then(r => setGroups(r.data));
    }, []);

    const handleCreate = (d: Record<string, unknown>) =>
        apiAdminCreateUser(d as Parameters<typeof apiAdminCreateUser>[0]).then(load);

    const handleEdit = (d: Record<string, unknown>) =>
        apiAdminUpdateUser((modal as { type: 'edit'; user: User }).user.id, d as Parameters<typeof apiAdminUpdateUser>[1]).then(load);

    const handleDelete = async () => {
        if (modal?.type !== 'delete') return;
        await apiAdminDeleteUser(modal.user.id);
        setModal(null);
        load();
    };

    return (
        <div className='min-h-screen bg-black flex'>

            <AdminAside/>

            <div className='flex-1 p-8'>
                <AdminPageHeader
                    title="Пользователи"
                    sub={`всего: ${total}`}
                    action={<Btn onClick={() => setModal({ type: 'create' })}>+ Добавить</Btn>}
                />

                <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Поиск по имени или email..." />

                <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800">
                                {['ID', 'Пользователь', 'Роль', 'Группа', 'Статус', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-widest">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-700 text-sm">
                                        нет данных
                                    </td>
                                </tr>
                            )}
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-900 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 text-xs text-gray-700">#{u.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar name={u.fullName} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">{u.fullName}</p>
                                                <p className="text-xs text-gray-600">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-gray-900 border border-gray-800 rounded px-2 py-0.5 text-xs text-gray-500">
                                            {u.role?.title ?? '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{u.studentGroup?.name ?? '—'}</td>
                                    <td className="px-4 py-3"><Badge active={u.isActive} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1.5 justify-end">
                                            <IconBtn color="indigo" title="Редактировать" onClick={() => setModal({ type: 'edit', user: u })}>✎</IconBtn>
                                            <IconBtn
                                                color={u.isActive ? 'yellow' : 'green'}
                                                title={u.isActive ? 'Деактивировать' : 'Активировать'}
                                                onClick={async () => { await apiAdminToggleActive(u.id); load(); }}
                                            >
                                                {u.isActive ? '⏸' : '▶'}
                                            </IconBtn>
                                            <IconBtn color="red" title="Удалить" onClick={() => setModal({ type: 'delete', user: u })}>✕</IconBtn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />

                {modal?.type === 'create' && (
                    <Modal title="Новый пользователь" onClose={() => setModal(null)}>
                        <UserForm roles={roles} groups={groups} onSubmit={handleCreate} onClose={() => setModal(null)} />
                    </Modal>
                )}
                {modal?.type === 'edit' && (
                    <Modal title="Редактировать пользователя" onClose={() => setModal(null)}>
                        <UserForm initial={modal.user} roles={roles} groups={groups} onSubmit={handleEdit} onClose={() => setModal(null)} />
                    </Modal>
                )}
                {modal?.type === 'delete' && (
                    <ConfirmDialog
                        message={`Удалить пользователя "${modal.user.fullName}"? Это действие необратимо.`}
                        onConfirm={handleDelete}
                        onCancel={() => setModal(null)}
                    />
                )}
            </div>
        </div>
    );
}