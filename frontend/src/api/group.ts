import { type ResponseError, type Group } from '../types/types'



export async function apiGetGroups() {

     const response = await fetch('/api/groups', {
            method: "GET",
            credentials: "include"
        })
    
        const responseData: Group[] | ResponseError = await response.json();
    
        if (!response.ok) {
            throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
        }
    
        console.log(responseData)

        return (responseData as Group[]);
    
}
