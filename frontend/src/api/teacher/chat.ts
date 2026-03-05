import { type Chat, type Message } from '../../components/observer/chats/types';



export async function apiTeacherGetChats(): Promise<Chat[]> {

    const res = await fetch('/api/chats', { credentials: 'include' });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки чатов');
    return data;
}



export async function apiTeacherGetMessages(chatId: number): Promise<Message[]> {

    const res = await fetch(`/api/chats/${chatId}/messages`, { credentials: 'include' });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки сообщений');
    return data;
}



export async function apiTeacherSendMessage(chatId: number, content: string): Promise<Message> {

    const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка отправки');
    return data;
}



export async function apiTeacherCreateChat(observerId: number): Promise<Chat> {

    const res = await fetch('/api/chats', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observerId }),
    });


    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка создания чата');
    return data;
}