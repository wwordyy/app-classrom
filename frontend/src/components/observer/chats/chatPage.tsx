import { useEffect, useState, useRef } from "react";
import { AsideBlock } from "../aside";
import { DashboardHeader } from "../../header";
import { type User, type Message, type Chat } from './types';
import { apiGetChats, apiGetMessages, apiSendMessage, apiCreateChat } from '../../../api/observer/chat';
import { apiGetMe, apiGetUsersByRole } from '../../../api/user';

function UserAvatar({ url, name, size = 'md', colorClass = 'bg-blue-200 text-blue-700' }: {
    url?: string | null;
    name: string;
    size?: 'sm' | 'md';
    colorClass?: string;
}) {
    const dim = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
    if (url) {
        return <img src={url} alt={name} className={`${dim} rounded-full object-cover flex-shrink-0`} />;
    }
    return (
        <div className={`${dim} rounded-full ${colorClass} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}

export function ChatsPage() {
    const [chats, setChats]               = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages]         = useState<Message[]>([]);
    const [newMessage, setNewMessage]     = useState("");
    const [teachers, setTeachers]         = useState<User[]>([]);
    const [showNewChat, setShowNewChat]   = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number>(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingRef     = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchChats();
        apiGetUsersByRole("teacher").then(setTeachers);
        apiGetMe().then(me => setCurrentUserId(me.id));
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

    const fetchChats    = async () => setChats(await apiGetChats());
    const fetchMessages = async (chatId: number) => setMessages(await apiGetMessages(chatId));

    const handleSelectChat = (chat: Chat) => { setSelectedChat(chat); setShowNewChat(false); };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        await apiSendMessage(newMessage.trim(), selectedChat.id);
        setNewMessage("");
        fetchMessages(selectedChat.id);
    };

    const handleCreateChat = async (teacherId: number) => {
        const data = await apiCreateChat(teacherId);
        await fetchChats();
        setShowNewChat(false);
        setSelectedChat(data);
    };

    const getChatCompanion = (chat: Chat) =>
        chat.users.find(u => u.user.id !== currentUserId)?.user;

    const getLastMessage = (chat: Chat) =>
        !chat.messages?.length ? "Нет сообщений" : chat.messages[0].content;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AsideBlock />
            <main className="flex-1 p-8">
                <DashboardHeader namePage="Чаты" />

                <div className="bg-white rounded-2xl shadow flex overflow-hidden" style={{ height: "75vh" }}>

                    {/* Левая панель */}
                    <div className="w-72 flex flex-col bg-stone-200">
                        <div className="p-4">
                            <button
                                className="w-full bg-neutral-500 text-white py-2 rounded-lg font-semibold hover:bg-neutral-700"
                                onClick={() => { setShowNewChat(!showNewChat); setSelectedChat(null); }}
                            >
                                + Новый чат
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {chats.map(chat => {
                                const companion = getChatCompanion(chat);
                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => handleSelectChat(chat)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 rounded transition ${selectedChat?.id === chat.id ? "bg-stone-100" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <UserAvatar
                                                url={companion?.avatarUrl}
                                                name={companion?.fullName ?? '?'}
                                            />
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

                        {/* Выбор преподавателя */}
                        {showNewChat && (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <h3 className="font-semibold text-lg mb-4">Выберите преподавателя</h3>
                                <div className="space-y-2">
                                    {teachers.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => handleCreateChat(t.id)}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-stone-100 hover:bg-stone-200 cursor-pointer transition"
                                        >
                                            <UserAvatar
                                                url={t.avatarUrl}
                                                name={t.fullName}
                                                colorClass="bg-green-200 text-green-700"
                                            />
                                            <span className="font-medium">{t.fullName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Сообщения */}
                        {selectedChat && !showNewChat && (
                            <>
                                <div className="p-4 flex items-center gap-3 bg-stone-200">
                                    <UserAvatar
                                        url={getChatCompanion(selectedChat)?.avatarUrl}
                                        name={getChatCompanion(selectedChat)?.fullName ?? '?'}
                                        size="sm"
                                    />
                                    <span className="font-semibold">{getChatCompanion(selectedChat)?.fullName}</span>
                                </div>

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
                                        className="bg-black text-white px-4 py-2 rounded-xl font-semibold"
                                    >
                                        Отправить
                                    </button>
                                </div>
                            </>
                        )}

                        {!selectedChat && !showNewChat && (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <p>Выберите чат или создайте новый</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}