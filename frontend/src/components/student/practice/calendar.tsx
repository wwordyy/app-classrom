

import { useState } from 'react';
import { type PracticePost } from './types'


export function DeadlineCalendar({ posts }: { posts: PracticePost[] }) {

    
    const [currentDate, setCurrentDate] = useState(new Date());

    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = new Date(year, month).toLocaleDateString("ru-RU", {
        month: "long", year: "numeric",
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay + 6) % 7;

    const deadlineMap: Record<number, PracticePost[]> = {};
    posts.forEach(post => {
        if (!post.dueDate) return;
        const d = new Date(post.dueDate);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!deadlineMap[day]) deadlineMap[day] = [];
            deadlineMap[day].push(post);
        }
    });

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
                >
                    ←
                </button>
                <h2 className="text-base font-semibold text-gray-700 capitalize">{monthName}</h2>
                <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
                >
                    →
                </button>
            </div>


            <div className="grid grid-cols-7 mb-2">
                {weekDays.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                        {d}
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const deadlines = deadlineMap[day] ?? [];
                    const hasDeadline = deadlines.length > 0;
                    const allDone = hasDeadline && deadlines.every(p => p.submittedAt);

                    return (
                        <div
                            key={day}
                            className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition
                                ${isToday(day) ? "bg-stone-800 text-white font-bold" : ""}
                                ${hasDeadline && !isToday(day) ? "bg-amber-50" : ""}
                                ${!hasDeadline && !isToday(day) ? "text-gray-700" : ""}
                            `}
                        >
                            <span>{day}</span>
                            {hasDeadline && (
                                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${allDone ? "bg-green-400" : "bg-amber-400"}`} />
                            )}
                        </div>
                    );
                })}
            </div>


            <div className="flex gap-4 mt-4 pt-3 border-t text-xs text-gray-400">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Дедлайн
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Сдано
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-stone-800 inline-block" /> Сегодня
                </span>
            </div>
        </div>
    );
}
