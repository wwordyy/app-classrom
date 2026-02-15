import {type ResponseError} from '../../types/types'

interface RequestLogin {
    email: string,
    password: string,
}

interface ResponseSucessLogin {
    token: string,
    user: {
        id: number,
        email: string
    },
}

const URL_BACKEND = "/api/auth";

export async function ApiLogin(data: RequestLogin) {

    const response = await fetch(`${URL_BACKEND}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });


    const responseData: ResponseSucessLogin | ResponseError = await response.json();

        if (!response.ok) {
            throw new Error((responseData as ResponseError).error || "Ошибка авторизации. Повторите попытку!")
        }

        return responseData;    
}    
