import { type Chat, type Message } from '../components/observer/chats/types'
import { type ResponseError } from '../types/types'



export async function apiGetChats() {

    const response = await fetch('/api/chats', {
        method: "GET",
        credentials: 'include',
    })

    const responseData: Chat[] | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }


    return (responseData as Chat[]);

}


export async function apiGetMessages(chatId: number) {

    const res = await fetch(`/api/chats/${chatId}/messages`, { 
        method: "GET",
        credentials: "include" 
    });

    const responseData: Message[] | ResponseError = await res.json();

    if (!res.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }


    return (responseData as Message[]);

    
}


export async function apiSendMessage(newMessage: string, chatId: number) {

    const response = await fetch(`/api/chats/${chatId}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });


    const responseData: Message | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }


    return (responseData as Message);
    
    
}


export async function apiCreateChat(teacherId: number) {
    
    const response = await fetch("/api/chats", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
    });

    const responseData: Chat | ResponseError = await response.json();

    if (!response.ok) {
        throw new Error((responseData as ResponseError).error || "Ошибка получения данных!")
    }


    return (responseData as Chat);
    
}