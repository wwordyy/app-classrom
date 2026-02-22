
import { type GroupsOverview } from '../group/types'

type Props = {
    group: GroupsOverview
}


export function GroupCardItem({ group }: Props) {

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
            <p className="text-sm text-gray-400">Не назначены</p>
            ) : (
            <ul className="space-y-1">
                <li>{group.teacher.fullName}</li>
            </ul>
            )}
        </div>

        <button className="w-full mt-4 bg-neutral-600 text-white py-2 
                                            rounded-xl hover:bg-neutral-700 transition">
            Назначить преподователя
        </button>
        </div>
     )
}