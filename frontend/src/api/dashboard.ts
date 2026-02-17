import { type ResponseError} from '../types/types'
import { type GroupStats } from '../components/observer/types/observerTypes'

interface ResponseSucessOverview {
    totalGroups: number;
    totalTeachers: number;
    totalStudents: number;
}

interface ResponseSuccessSubmissionsStats {
    totalExpected: number,
    submittedOnTime: number,
    late: number,
    percentSubmitted: number,
    percentLate: number,
}


export async function apiGetOverview() {

    const response = await fetch('/api/dashboard/overview', {
        method: "GET",
        credentials: "include",
    })

        const responseData: ResponseSucessOverview | ResponseError = await response.json();
    
        if (!response.ok) {
            throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
        }
    
        return (responseData as ResponseSucessOverview);
    
}


export async function  apiGetGroupStats() {
    
    const response = await fetch('/api/dashboard/groups', {
        method: "GET",
        credentials: "include",
    })

    
    const responseData: GroupStats[] | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as GroupStats[]);


    
}

export async function apiGetSubmissionStats() {

    const response = await fetch('/api/dashboard/submissions', {
        method: "GET",
        credentials: "include",
    })

    
    const responseData: ResponseSuccessSubmissionsStats | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as ResponseSuccessSubmissionsStats);
}