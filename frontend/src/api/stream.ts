
import { type ResponseError, type ResponseSuccess } from '../types/types';
import { type CreateStreamDto } from '../components/observer/types/observerTypes'



export async function apiAddStream(data: CreateStreamDto) {
    
    const response = await fetch('/api/stream', {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    })


    const responseData: ResponseSuccess | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }

    return (responseData as ResponseSuccess);

}
