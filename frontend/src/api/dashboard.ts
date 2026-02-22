import { type ResponseError} from '../types/types'
import { type GroupStats, type GroupsOverview } from '../components/observer/dashboard/types'


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



const URL_BACKEND = '/api/dashboard'

export async function apiGetOverview() {

    const response = await fetch(`${URL_BACKEND}/overview`, {
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
    
    const response = await fetch(`${URL_BACKEND}/groups/stats`, {
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

    const response = await fetch(`${URL_BACKEND}/submissions`, {
        method: "GET",
        credentials: "include",
    })

    
    const responseData: ResponseSuccessSubmissionsStats | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as ResponseSuccessSubmissionsStats);
}


export async function apiGetGroupsOverview() {

    const response = await fetch(`${URL_BACKEND}/groups`, {
        method: "GET",
        credentials: "include",
    })

    const responseData: GroupsOverview[] | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as GroupsOverview[]);

    
}