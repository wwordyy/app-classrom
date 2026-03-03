import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";
import { apiGetStudentGrades } from "../../../api/teacher/journal";
import { type StudentGrades } from "./types";

import { apiUpsertPracticeResult, apiGetPracticeResult} from '../../../api/teacher/journal'
import { PracticeResultModal } from './practiceResultModal'

export function TeacherStudentGradesPage() {
    const { studentId } = useParams<{ studentId: string }>();
    const [data, setData]               = useState<StudentGrades | null>(null);
    const [error, setError]             = useState<string | null>(null);
    const [practiceResult, setPracticeResult] = useState<{ grade: number; comment: string | null } | null>(null);
    const [showModal, setShowModal]     = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        if (!studentId) return;
        apiGetStudentGrades(Number(studentId))
            .then(async (res) => {
                setData(res);

                if (res.groupId) {
                    const result = await apiGetPracticeResult(res.groupId, Number(studentId));
                    setPracticeResult(result);
                }
            })
            .catch((e) => setError(e.message));

    }, [studentId]);

    const handleSave = async (grade: number, comment: string) => {
        if (!data?.groupId || !studentId) return;
        const result = await apiUpsertPracticeResult(data.groupId, Number(studentId), grade, comment);
        setPracticeResult(result);
    };

    const getGradeClass = (grade: number | null) => {
        if (!grade) return "text-gray-400";
        if (grade <= 2) return "text-red-600 font-semibold";
        if (grade === 3) return "text-orange-500 font-semibold";
        if (grade === 4) return "text-yellow-600 font-semibold";
        return "text-green-600 font-semibold";
    };

    if (error) return <p className="p-8 text-red-500">{error}</p>;
    if (!data)  return <p className="p-8">Загрузка...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <TeacherAside />

            <main className="flex-1 p-8">

                <div className="no-print">
                    <DashboardHeader namePage={data.student.fullName} />
                </div>

                <div className="hidden print:block mb-4">
                    <h1 className="text-2xl font-bold">{data.student.fullName}</h1>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => navigate('/teacher/journal')}
                        className="text-stone-500 hover:text-black transition no-print"
                    >
                        Назад
                    </button>

                    <div className="flex items-center gap-3 no-print">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl 
                                                hover:bg-amber-600 transition text-sm "
                        >
                            {practiceResult ? `Итоговая оценка: ${practiceResult.grade}` : 'Выставить итоговую оценку'}
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-neutral-600 text-white rounded-xl 
                                                        hover:bg-neutral-800 transition no-print text-sm"
                        >
                            Выгрузить PDF
                        </button>
                    </div>
                </div>

                {practiceResult && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Итоговая оценка за практику</p>
                            {practiceResult.comment && (
                                <p className="text-xs text-amber-700 mt-1">{practiceResult.comment}</p>
                            )}
                        </div>
                        <span className={`text-3xl font-bold ${getGradeClass(practiceResult.grade)}`}>
                            {practiceResult.grade}
                        </span>
                    </div>
                )}

                <div className="space-y-3">
                    {data.posts.length === 0 ? (
                        <p className="text-stone-500">Заданий нет</p>
                    ) : (
                        data.posts.map((post) => (
                            <div key={post.id} className="bg-white shadow rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{post.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {post.typePost} · Сдать до:{" "}
                                            {new Date(post.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl ${getGradeClass(post.grade)}`}>
                                            {post.grade ?? "-"}
                                            <span className="text-sm text-stone-400">/{post.maxScore}</span>
                                        </p>
                                        <p className="text-xs text-stone-400">{post.status}</p>
                                    </div>
                                </div>

                                {post.feedBackTeacher && (
                                    <p className="mt-3 text-sm text-neutral-600 bg-gray-50 rounded-lg p-2">
                                        💬 {post.feedBackTeacher}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>

            {showModal && (
                <PracticeResultModal
                    studentName={data.student.fullName}
                    current={practiceResult}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}