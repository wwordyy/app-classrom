import { type ResponseError, type User } from '../types/types'


interface ResponseSucessUser {
    user: User
}


export async function apiGetMe() {

    const response = await fetch('/api/me', {
        method: "GET",
        credentials: "include"
    })

    const responseData: ResponseSucessUser | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as ResponseSucessUser);

    
}

