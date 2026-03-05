import { useEffect, useState, useRef } from "react";
import { DashboardHeader } from "../../header";
import { StudentAside } from "../studentAside";
import { apiGetMe } from '../../../api/user';
import { type Message, type Chat } from '../../observer/chats/types';
import { apiCreateChatWithTeacher } from '../../../api/student/profile';
import { apiStudentGetChats, apiStudentGetMessages, apiStudentSendMessage } from '../../../api/student/chats';

function UserAvatar({ url, name, size = 'md' }: {
    url?: string | null;
    name: string;
    size?: 'sm' | 'md';
}) {
    const dim = size === 'sm' ? 'w-9 h-9 text-sm' : 'w-10 h-10 text-sm';
    if (url) {
        return <img src={url} alt={name} className={`${dim} rounded-full object-cover flex-shrink-0`} />;
    }
    return (
        <div className={`${dim} rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold flex-shrink-0`}>
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}

export function StudentChatsPage() {
    const [chats, setChats]                 = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat]   = useState<Chat | null>(null);
    const [messages, setMessages]           = useState<Message[]>([]);
    const [newMessage, setNewMessage]       = useState("");
    const [currentUserId, setCurrentUserId] = useState<number>(0);
    const [error, setError]                 = useState<string | null>(null);
    const [initLoading, setInitLoading]     = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingRef     = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        apiGetMe().then(me => setCurrentUserId(me.id));
        fetchChats();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!selectedChat) return;
        fetchMessages(selectedChat.id);
        pollingRef.current = setInterval(() => fetchMessages(selectedChat.id), 3000);
        return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }, [selectedChat]);

    const fetchChats = async () => {
        const res = await apiStudentGetChats().catch(() => []);
        setChats(res);
    };

    const fetchMessages = async (chatId: number) => {
        const res = await apiStudentGetMessages(chatId).catch(() => []);
        setMessages(res);
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        await apiStudentSendMessage(selectedChat.id, newMessage.trim());
        setNewMessage("");
        fetchMessages(selectedChat.id);
    };

    const handleOpenTeacherChat = async () => {
        setInitLoading(true);
        setError(null);
        try {
            const chat = await apiCreateChatWithTeacher();
            await fetchChats();
            setSelectedChat(chat);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setInitLoading(false);
        }
    };

    const getChatCompanion = (chat: Chat) =>
        chat.users.find(u => u.user.id !== currentUserId)?.user;

    const getLastMessage = (chat: Chat) =>
        chat.messages?.length > 0 ? chat.messages[0].content : "Нет сообщений";

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StudentAside />
            <main className="flex-1 p-8">
                <DashboardHeader namePage="Чаты" />

                {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

                <div className="bg-white rounded-2xl shadow flex overflow-hidden" style={{ height: "75vh" }}>

                    {/* Левая панель */}
                    <div className="w-72 flex flex-col bg-stone-200">
                        <div className="p-4">
                            <button
                                onClick={handleOpenTeacherChat}
                                disabled={initLoading}
                                className="w-full bg-neutral-500 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700 transition disabled:bg-gray-300"
                            >
                                {initLoading ? "..." : "Написать преподавателю"}
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {chats.map(chat => {
                                const companion = getChatCompanion(chat);
                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 rounded transition ${selectedChat?.id === chat.id ? "bg-stone-100" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <UserAvatar url={companion?.avatarUrl} name={companion?.fullName ?? '?'} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{companion?.fullName ?? "Неизвестно"}</p>
                                                <p className="text-gray-400 text-xs truncate">{getLastMessage(chat)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {chats.length === 0 && (
                                <p className="text-gray-400 text-sm text-center mt-8">Нет чатов</p>
                            )}
                        </div>
                    </div>

                    {/* Правая панель */}
                    <div className="flex-1 flex flex-col">
                        {selectedChat ? (
                            <>
                                {/* Шапка */}
                                <div className="p-4 flex items-center gap-3 bg-stone-200">
                                    <UserAvatar
                                        url={getChatCompanion(selectedChat)?.avatarUrl}
                                        name={getChatCompanion(selectedChat)?.fullName ?? '?'}
                                        size="sm"
                                    />
                                    <span className="font-semibold">{getChatCompanion(selectedChat)?.fullName}</span>
                                </div>

                                {/* Сообщения */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map(msg => {
                                        const isMe = msg.author.id === currentUserId;
                                        return (
                                            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                                                {!isMe && (
                                                    <UserAvatar
                                                        url={msg.author.avatarUrl}
                                                        name={msg.author.fullName}
                                                        size="sm"
                                                    />
                                                )}
                                                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-zinc-400 text-white" : "bg-gray-100 text-gray-800"}`}>
                                                    <p>{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${isMe ? "text-white" : "text-gray-400"}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Ввод */}
                                <div className="p-4 flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 bg-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none"
                                        placeholder="Введите сообщение..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSend()}
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="bg-black text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition"
                                    >
                                        Отправить
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <p>Выберите чат или напишите преподавателю</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}