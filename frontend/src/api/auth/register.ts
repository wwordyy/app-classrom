import {type ResponseError} from '../../types/types'

interface RequestRegister{
    fullName: string;
    email: string;
    password: string;
}


interface ResponseSucessRegister{
    id: number;
    email: string;
}

const URL_BACKEND = "/api/auth";

export async function ApiRegister(data: RequestRegister) {

    const response = await fetch(`${URL_BACKEND}/register`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)

    })

    const responseData: ResponseSucessRegister | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка регистрации. Повторите попытку!")
    }

    return responseData;

    
}