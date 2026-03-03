import { useState, useEffect, useCallback } from 'react';
import type { GroupItem, GroupDetail, User } from '../types';
import {
    apiAdminGetGroups, apiAdminGetGroup,
    apiAdminCreateGroup, apiAdminUpdateGroup, apiAdminDeleteGroup,
} from '../../../api/admin/group';
import { apiAdminGetUsers } from '../../../api/admin/user';
import {
    Btn, Field, inputCls, Badge, Avatar, Modal,
    ConfirmDialog, Pagination, AdminPageHeader, SearchInput,
} from '../shared/adminUI'

import { AdminAside } from '../shared/adminAside'


function GroupForm({ initial, teachers, onSubmit, onClose }: {
    initial?: GroupItem; teachers: User[];
    onSubmit: (d: Record<string, unknown>) => Promise<void>;
    onClose: () => void;
}) {


    const [form, setForm] = useState({
        name:       initial?.name       ?? '',
        courseYear: initial?.courseYear ? String(initial.courseYear) : '',
        specialty:  initial?.specialty   ?? '',
        teacherId:  initial?.teacher?.id ? String(initial.teacher.id) : '',
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
            payload.courseYear = Number(payload.courseYear);
            payload.teacherId  = payload.teacherId ? Number(payload.teacherId) : null;
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
            <div className="grid grid-cols-2 gap-3">
                <Field label="Название *">
                    <input className={inputCls} value={form.name} onChange={set('name')} required placeholder="ИСТ-21" />
                </Field>
                <Field label="Курс *">
                    <input className={inputCls} type="number" min={1} max={6} value={form.courseYear} onChange={set('courseYear')} required placeholder="2" />
                </Field>
            </div>
            <Field label="Специальность *">
                <input className={inputCls} value={form.specialty} onChange={set('specialty')} required placeholder="Информационные системы и технологии" />
            </Field>
            <Field label="Куратор">
                <select className={inputCls} value={form.teacherId} onChange={set('teacherId')}>
                    <option value="">— не назначен —</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                </select>
            </Field>
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <div className="flex gap-2 justify-end mt-2">
                <Btn variant="ghost" onClick={onClose}>Отмена</Btn>
                <Btn type="submit" disabled={loading}>{loading ? '...' : initial ? 'Сохранить' : 'Создать'}</Btn>
            </div>
        </form>
    );
}


function StudentsModal({ group, onClose }: { group: GroupDetail; onClose: () => void }) {
    return (
        <Modal title={`студенты — ${group.name}`} onClose={onClose} maxWidth="max-w-md">
            {group.students.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">В группе нет студентов</p>
            ) : (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                    {group.students.map(s => (
                        <div key={s.id} className="flex items-center gap-2.5 p-3 bg-black rounded-xl border border-gray-900">
                            <Avatar name={s.fullName} size="sm" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-200">{s.fullName}</p>
                                <p className="text-xs text-gray-600">{s.email}</p>
                            </div>
                            <Badge active={s.isActive} />
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
}

type ModalState =
    | { type: 'create' }
    | { type: 'edit';     group: GroupItem }
    | { type: 'delete';   group: GroupItem }
    | { type: 'students'; detail: GroupDetail }
    | null;

const YEAR_COLORS: Record<number, string> = {
    1: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    2: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    3: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    4: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    5: 'bg-red-500/10 text-red-400 border-red-500/20',
    6: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export function AdminGroupsPage() {


    const [groups,   setGroups]   = useState<GroupItem[]>([]);
    const [total,    setTotal]    = useState(0);
    const [page,     setPage]     = useState(1);
    const [search,   setSearch]   = useState('');
    const [teachers, setTeachers] = useState<User[]>([]);
    const [modal,    setModal]    = useState<ModalState>(null);
    const LIMIT = 12;

    const load = useCallback(async () => {
        const res = await apiAdminGetGroups({ page, limit: LIMIT, search });
        setGroups(res.data);
        setTotal(res.total);
    }, [page, search]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        apiAdminGetUsers({ limit: 1000 }).then(r => setTeachers(r.data));
    }, []);

    const handleCreate = (d: Record<string, unknown>) =>
        apiAdminCreateGroup(d as Parameters<typeof apiAdminCreateGroup>[0]).then(load);

    const handleEdit = (d: Record<string, unknown>) =>
        apiAdminUpdateGroup((modal as { type: 'edit'; group: GroupItem }).group.id, d as Parameters<typeof apiAdminUpdateGroup>[1]).then(load);

    const handleDelete = async () => {
        if (modal?.type !== 'delete') return;
        await apiAdminDeleteGroup(modal.group.id);
        setModal(null);
        load();
    };

    const openStudents = async (id: number) => {
        const detail = await apiAdminGetGroup(id);
        setModal({ type: 'students', detail });
    };

    return (

        <div className='min-h-screen bg-black flex'>

            <AdminAside/>

            <div className='flex-1 p-8'>
                <AdminPageHeader
                    title="Группы"
                    sub={`всего: ${total}`}
                    action={<Btn onClick={() => setModal({ type: 'create' })}>+ Добавить</Btn>}
                />

                <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Поиск по названию или специальности..." />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {groups.length === 0 && (
                        <p className="text-gray-700 col-span-full text-center py-12 text-sm">нет групп</p>
                    )}
                    {groups.map(g => (
                        <div key={g.id} className="bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-white">{g.name}</h3>
                                    <p className="text-xs text-gray-600 mt-0.5">{g.specialty}</p>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg border flex-shrink-0 ${YEAR_COLORS[g.courseYear] ?? 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                    {g.courseYear} курс
                                </span>
                            </div>

                            <div className="space-y-2 py-3 border-t border-gray-900 mb-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Куратор</span>
                                    <span className="text-gray-400 font-medium">{g.teacher?.fullName ?? '—'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Студентов</span>
                                    <span className="text-gray-400 font-semibold">{g._count?.students ?? 0}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openStudents(g.id)}
                                    className="flex-1 py-1.5 rounded-lg border border-gray-800 text-gray-600 hover:border-indigo-500/40 hover:text-indigo-400 transition-colors text-xs font-semibold uppercase tracking-wider cursor-pointer bg-transparent"
                                >
                                    Студенты
                                </button>
                                <button
                                    onClick={() => setModal({ type: 'edit', group: g })}
                                    className="w-8 h-8 rounded-lg border border-gray-800 bg-transparent text-gray-600 hover:border-indigo-500/40 hover:text-indigo-400 transition-colors text-sm cursor-pointer flex items-center justify-center"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => setModal({ type: 'delete', group: g })}
                                    className="w-8 h-8 rounded-lg border border-gray-800 bg-transparent text-gray-600 hover:border-red-500/40 hover:text-red-400 transition-colors text-sm cursor-pointer flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />

                {modal?.type === 'create' && (
                    <Modal title="новая группа" onClose={() => setModal(null)}>
                        <GroupForm teachers={teachers} onSubmit={handleCreate} onClose={() => setModal(null)} />
                    </Modal>
                )}
                {modal?.type === 'edit' && (
                    <Modal title="редактировать группу" onClose={() => setModal(null)}>
                        <GroupForm initial={modal.group} teachers={teachers} onSubmit={handleEdit} onClose={() => setModal(null)} />
                    </Modal>
                )}
                {modal?.type === 'delete' && (
                    <ConfirmDialog
                        message={`Удалить группу "${modal.group.name}"? Это действие необратимо.`}
                        onConfirm={handleDelete}
                        onCancel={() => setModal(null)}
                    />
                )}
                {modal?.type === 'students' && (
                    <StudentsModal group={modal.detail} onClose={() => setModal(null)} />
                )}
            </div>
        </div>
    );
}