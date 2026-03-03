
import { useState } from "react";
import { type updSubmissionModalProps } from './types'

export function UpdSubmissionModal({ isOpen, onClose, onSubmit, studentName, currentGrade, currentComment }: updSubmissionModalProps) {

    
    const [grade, setGrade] = useState<number>(currentGrade ?? 1);
    const [comment, setComment] = useState<string>(currentComment ?? "");

    if (!isOpen) return null;

    function handleSubmit() {
        if (grade < 1 || grade > 5) {
            alert("Оценка должна быть от 1 до 5");
            return;
        }
        onSubmit(grade, comment);
        onClose();
    }

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Оценка для {studentName}</h2>

        <div className="mb-4">
            <label className="block mb-1 font-medium">Оценка (1-5)</label>
            <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full rounded-lg p-2 bg-stone-200 focus:outline-none"
            >
                {[1, 2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>
        </div>

        <div className="mb-4">
            <label className="block mb-1 font-medium">Комментарий</label>
            <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-lg p-2 bg-stone-200 min-h-[2rem] focus:outline-none"
            />
        </div>

        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-white rounded-lg bg-red-500 hover:bg-red-700">
                Отмена
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/70">
                Сохранить
            </button>
        </div>
        </div>
</div>
);
}