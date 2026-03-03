
import { useNavigate } from 'react-router-dom'
import { type GroupsOverview } from '../group/types'
import { apiRemoveTeacher } from '../../../api/observer/group'

type Props = {
    group: GroupsOverview
}


export function GroupCardItem({ group }: Props) {

    const navigate = useNavigate();

    const handleRemoveTeacher = async () => {
        const data = await apiRemoveTeacher(group.id)

        if (data.ok) {
            window.location.reload();
        } 

    }

     return (
        <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition justify-between flex 
                                    flex-col">
        
        <div className="flex justify-between items-start mb-4">
            <div>
            <h3 className="text-xl font-semibold">{group.name}</h3>
            <p className="text-sm text-gray-500">
                {group.courseYear} курс
            </p>
            </div>

            <span className="bg-neutral-400 text-white text-sm px-3 py-1 rounded-full">
            {group.studentsCount} студентов
            </span>
        </div>

        <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Преподаватель:</p>
            {group.teacher === null ? (
                <p className="text-sm text-gray-400">Не назначен</p>
            ) : (
                <div className="flex items-center justify-between">
                    <span className="text-sm">{group.teacher.fullName}</span>
                    <button
                        onClick={handleRemoveTeacher}
                        className="text-red-500 text-xs hover:text-red-700"
                    >
                        Удалить
                    </button>
                </div>
            )}
        </div>

        <button
                className={`w-full mt-4 py-2 rounded-xl transition text-white ${
                    group.teacher 
                        ? "bg-stone-400 hover:bg-neutral-500"
                        : "bg-neutral-600 hover:bg-neutral-700"  
                }`}
                onClick={() => navigate(`/observer/groups/${group.id}/assign-teacher`)}
            >
                Назначить преподавателя
            </button>
        </div>
     )
}