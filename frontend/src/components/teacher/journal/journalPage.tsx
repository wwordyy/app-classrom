import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";
import { apiGetGroupStudents } from "../../../api/teacher/journal";
import { type JournalStudentList } from "./types";

export function TeacherJournalPage() {
    const [data, setData] = useState<JournalStudentList | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        apiGetGroupStudents()
            .then(setData)
            .catch((e) => setError(e.message));
    }, []);

    if (error) return <p className="p-8 text-red-500">{error}</p>;
    if (!data) return <p className="p-8">Загрузка...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <TeacherAside />

            <main className="flex-1 p-8">
                <DashboardHeader namePage={`Журнал: ${data.groupName}`} />

                <div className="space-y-3">
                    {data.students.length === 0 ? (
                        <p className="text-gray-500">Студенты не найдены</p>
                    ) : (
                        data.students.map((student) => (
                            <div
                                key={student.id}
                                onClick={() => navigate(`/teacher/journal/${student.id}`)}
                                className="bg-white shadow rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition animation-card"
                            >
                                <div className="flex items-center gap-4">
                                    {student.avatarUrl ? (
                                        <img
                                            src={student.avatarUrl}
                                            alt={student.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                            {student.fullName.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-semibold">{student.fullName}</p>
                                        <p className="text-sm text-gray-500">{student.email}</p>
                                    </div>
                                </div>

                                <span className="text-gray-400 text-xl">{"->"}</span>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}