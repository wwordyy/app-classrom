import { useState } from "react";


export function PracticeResultModal({ studentName, current, onSave, onClose }: {
    studentName: string;
    current: { grade: number; comment: string | null } | null;
    onSave: (grade: number, comment: string) => Promise<void>;
    onClose: () => void;
}) {
    const [grade,   setGrade]   = useState<number>(current?.grade ?? 5);
    const [comment, setComment] = useState(current?.comment ?? '');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            await onSave(grade, comment);
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Итоговая оценка</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                <p className="text-sm text-gray-500">{studentName}</p>

                <div>
                    <label className="block text-sm font-medium mb-1">Оценка</label>
                    <select
                        value={grade}
                        onChange={e => setGrade(Number(e.target.value))}
                        className="w-full bg-stone-100 rounded-lg p-2 focus:outline-none hover:bg-stone-200 transition"
                    >
                        {[2, 3, 4, 5].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Комментарий (необязательно)</label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={3}
                        placeholder="Общая характеристика практики..."
                        className="w-full bg-stone-100 rounded-lg p-3 text-sm focus:outline-none hover:bg-stone-200 transition resize-none"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-2 justify-end pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 transition disabled:bg-gray-300"
                    >
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
}
