import { type ReactNode, useEffect } from 'react';

export function Badge({ active }: { active: boolean }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${
            active
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${active ? 'bg-green-500' : 'bg-red-500'}`} />
            {active ? 'active' : 'inactive'}
        </span>
    );
}

const AVATAR_COLORS = [
    'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'bg-amber-500/20 text-amber-400 border-amber-500/30',
];

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
    const colorClass = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
    const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
    return (
        <div className={`${sizeClass} rounded-lg border font-bold flex items-center justify-center flex-shrink-0 ${colorClass}`}>
            {name[0].toUpperCase()}
        </div>
    );
}

type BtnVariant = 'primary' | 'ghost' | 'danger' | 'outline';

export function Btn({ children, onClick, variant = 'primary', type = 'button', disabled }: {
    children: ReactNode;
    onClick?: () => void;
    variant?: BtnVariant;
    type?: 'button' | 'submit';
    disabled?: boolean;
}) {
    const base = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed';
    const variants: Record<BtnVariant, string> = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-600',
        ghost:   'bg-transparent hover:bg-white/5 text-gray-500 border-gray-800',
        danger:  'bg-transparent hover:bg-red-500/10 text-red-400 border-red-500/30',
        outline: 'bg-transparent hover:bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
            {children}
        </button>
    );
}

export function IconBtn({ children, onClick, color, title }: {
    children: ReactNode; onClick: () => void; title?: string;
    color: 'indigo' | 'yellow' | 'red' | 'green';
}) {
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
        yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
        red:    'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
        green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    };
    return (
        <button title={title} onClick={onClick}
            className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm transition-colors cursor-pointer ${colors[color]}`}>
            {children}
        </button>
    );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

export const inputCls = 'w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-200 outline-none focus:border-indigo-500/50 transition-colors placeholder-gray-700';

export function Modal({ title, onClose, children, maxWidth = 'max-w-lg' }: {
    title: string; onClose: () => void; children: ReactNode; maxWidth?: string;
}) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-gray-950 border border-gray-800 rounded-xl p-6 w-full ${maxWidth} shadow-2xl animate-fade-slide`}>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-sm font-semibold text-gray-200 tracking-wide">
                        <span className="text-indigo-400">//</span> {title}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none cursor-pointer bg-transparent border-none">
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function ConfirmDialog({ message, onConfirm, onCancel }: {
    message: string; onConfirm: () => void; onCancel: () => void;
}) {
    return (
        <Modal title="подтверждение" onClose={onCancel} maxWidth="max-w-sm">
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>
            <div className="flex gap-2 justify-end">
                <Btn variant="ghost" onClick={onCancel}>Отмена</Btn>
                <Btn variant="danger" onClick={onConfirm}>Удалить</Btn>
            </div>
        </Modal>
    );
}

export function Pagination({ page, total, limit, onChange }: {
    page: number; total: number; limit: number; onChange: (p: number) => void;
}) {
    const pages = Math.ceil(total / limit);
    if (pages <= 1) return null;

    return (
        <div className="flex gap-1 items-center justify-center pt-5">
            <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}>‹</PageBtn>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>{p}</PageBtn>
            ))}
            <PageBtn disabled={page === pages} onClick={() => onChange(page + 1)}>›</PageBtn>
        </div>
    );
}

function PageBtn({ children, onClick, active, disabled }: {
    children: ReactNode; onClick?: () => void; active?: boolean; disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`min-w-[30px] h-[30px] rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                active
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    : 'bg-transparent text-gray-600 border-gray-800 hover:text-gray-400'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
}

export function AdminPageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
    return (
        <div className="flex justify-between items-start mb-6">
            <div>
                <p className="text-xs text-gray-700 uppercase tracking-widest mb-1">{sub ?? 'admin panel'}</p>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    <span className="text-indigo-400">//</span> {title}
                </h1>
            </div>
            {action}
        </div>
    );
}

export function SearchInput({ value, onChange, placeholder }: {
    value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div className="mb-5">
            <input
                className={`${inputCls} max-w-xs`}
                placeholder={placeholder ?? 'поиск...'}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}