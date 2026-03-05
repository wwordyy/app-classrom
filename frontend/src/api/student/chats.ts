import { type Chat, type Message } from '../../components/observer/chats/types';


export async function apiStudentGetChats(): Promise<Chat[]> {

    const res = await fetch('/api/chats', { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');

    return data;
}

export async function apiStudentGetMessages(chatId: number): Promise<Message[]> {

    const res = await fetch(`/api/chats/${chatId}/messages`, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Ошибка загрузки');

    return data;
}

export async function apiStudentSendMessage(chatId: number, content: string): Promise<Message> {

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