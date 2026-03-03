
export interface ResponseError {
    error: string
}

export interface ResponseSuccess {
    ok: boolean,
}

export interface User {
    id: number,
    fullName: string,
    email: string,
    avatarUrl?: string,
    role?: {
        title?: string
    },
}


export interface Group {
    id: number,
    name: string,
    courseYear: number,
    specialty: string

}

