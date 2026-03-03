import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AsideBlock } from "../aside";
import { DashboardHeader } from "../../header";
import { apiGetFreeTeachers } from '../../../api/user'
import { apiAssignTeacher } from '../../../api/observer/group'
import { type User } from "../../../types/types";

export function AssignTeacherPage() {

    const { groupId } = useParams();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState<User[]>([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            
            const data = await apiGetFreeTeachers();
            setTeachers(data);
        };
        fetchTeachers();
    }, []);

    const handleAssign = async (teacherId: number) => {
        const data = await apiAssignTeacher(Number(groupId), teacherId)

        if (data.ok) {
            navigate("/observer/groups");
        }

        console.log("Ошибка при назначении учителя!")
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
        <AsideBlock />
        <main className="flex-1 p-8">
            <DashboardHeader namePage="Назначить преподавателя" />

            <div className="grid grid-cols-3 gap-6">
            {teachers.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-3">
                
                {t.avatarUrl ? (
                    <img src={t.avatarUrl} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold">
                    {t.fullName[0]}
                    </div>
                )}

                <div className="text-center">
                    <p className="font-semibold text-lg">{t.fullName}</p>
                    <p className="text-sm text-gray-500">{t.email}</p>
                </div>

                <button
                    onClick={() => handleAssign(t.id)}
                    className="w-full mt-2 bg-neutral-600 text-white py-2 rounded-xl hover:bg-neutral-700 transition"
                >
                    Назначить
                </button>
                </div>
            ))}

            {teachers.length === 0 && (
                <p className="text-gray-400 col-span-3 text-center mt-10">Нет свободных преподавателей</p>
            )}
            </div>
        </main>
        </div>
    );
}