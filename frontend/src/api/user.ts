import { type ResponseError, type User } from '../types/types'





export async function apiGetMe() {

    const response = await fetch('/api/me', {
        method: "GET",
        credentials: "include"
    })

    const responseData: User | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as User);

    
}


export async function apiGetUsersByRole(role: string) {

    const response = await fetch(`/api/users/by-role?role=${role}`, {
        method: "GET",
        credentials: "include",    
    })

    const responseData: User[] | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as User[]);
    


}
