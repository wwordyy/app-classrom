import { useEffect, useState } from 'react';
import { type TeacherStat } from './types'
import { apiGetTeacherStats } from '../../../api/observer/dashboard'


export function TeacherStats () {

    const [teachersStats, setTeachersStats] = useState<TeacherStat[]>([]);

    useEffect(() => {

        const fetchData = async () => {
            const response = await apiGetTeacherStats();
            setTeachersStats(response);

        }
        fetchData();
    }, []);

    return (

        <table className="w-full text-left">
        <thead>
            <tr className="border-b">
                <th className="py-3">Группа</th>
                <th className="py-3">Преподаватель</th>
                <th className="py-3">Студентов</th>
                <th className="py-3">% сдачи</th>
                <th className="py-3">Средний балл</th>
            </tr>
        </thead>
        <tbody>
            {teachersStats.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{row.groupName}</td>
                    <td className="py-3">{row.teacherName}</td>
                    <td className="py-3">{row.studentsCount}</td>
                    <td className="py-3">
                        <span className={`font-semibold ${
                            row.percentSubmitted >= 75 ? 'text-green-600' :
                            row.percentSubmitted >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                            {row.percentSubmitted}%
                        </span>
                    </td>
                    <td className="py-3">
                        <span className={`font-semibold ${
                            row.avgGrade === null ? 'text-gray-400' :
                            row.avgGrade >= 4.5 ? 'text-green-600' :
                            row.avgGrade >= 3.5 ? 'text-yellow-600' :
                            row.avgGrade >= 2.5 ? 'text-orange-500' :
                            'text-red-600'
                        }`}>
                            {row.avgGrade ?? '—'}
                        </span>
                    </td>
                </tr>
            ))}

            {teachersStats.length === 0 && (
                <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                        Нет данных
                    </td>
                </tr>
            )}
        </tbody>
    </table> 
    );
    
}