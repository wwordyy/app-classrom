
import { type ResponseError } from '../../types/types'
import { type TeacherGroupDashboard} from '../../components/teacher/dashboard/types' 


export async function apiGetTeacherDashboard() {


    const response = await fetch('/api/teacher/dashboard', {
        method: "GET",
        credentials: "include"
    })
    

    const responseData: TeacherGroupDashboard[] | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as TeacherGroupDashboard[]);
}

