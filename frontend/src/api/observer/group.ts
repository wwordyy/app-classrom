import { type ResponseError, type Group, type ResponseSuccess } from '../../types/types'



export async function apiGetGroups() {

     const response = await fetch('/api/groups', {
            method: "GET",
            credentials: "include"
        })
    
        const responseData: Group[] | ResponseError = await response.json();
    
        if (!response.ok) {
            throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
        }
    

        return (responseData as Group[]);
    
}


export async function apiAssignTeacher(groupId: number, teacherId: number) {

        const response =  await fetch(`/api/groups/${groupId}/assign-teacher`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teacherId }),
        });

        const responseData: ResponseSuccess | ResponseError = await response.json();
    
        if (!response.ok) {
            throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
        }
    

        return (responseData as ResponseSuccess);
        
}


export async function apiRemoveTeacher(groupId:number) {

    const response =  await fetch(`/api/groups/${groupId}/remove-teacher`, {
        method: "DELETE",
        credentials: "include",
    });

    const responseData: ResponseSuccess | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }


    return (responseData as ResponseSuccess);
    

}