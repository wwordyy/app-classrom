import { useEffect, useState, useRef } from "react";
import { DashboardHeader } from "../../header";
import { TeacherAside } from "../teacherAside";
import { type Chat, type Message, type User } from '../../observer/chats/types';
import {
    apiTeacherGetChats,
    apiTeacherGetMessages,
    apiTeacherSendMessage,
    apiTeacherCreateChat,
} from '../../../api/teacher/chat';
import { apiGetMe, apiGetUsersByRole } from '../../../api/user';

type Tab = 'students' | 'observers';

function UserAvatar({ url, name, size = 'md', colorClass }: {
    url?: string | null;
    name: string;
    size?: 'sm' | 'md';
    colorClass: string;
}) {
    const dim = size === 'sm' ? 'w-9 h-9 text-sm' : 'w-10 h-10 text-sm';
    if (url) {
        return <img src={url} alt={name} className={`${dim} rounded-full object-cover flex-shrink-0`} />;
    }
    return (
        <div className={`${dim} rounded-full ${colorClass} flex items-center justify-center font-bold flex-shrink-0`}>
            {name?.[0]?.toUpperCase() ?? '?'}
        </div>
    );
}

export function TeacherChatsPage() {
    const [chats, setChats]               = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages]         = useState<Message[]>([]);
    const [newMessage, setNewMessage]     = useState("");
    const [students, setStudents]         = useState<User[]>([]);
    const [observers, setObservers]       = useState<User[]>([]);
    const [showNewChat, setShowNewChat]   = useState(false);
    const [activeTab, setActiveTab]       = useState<Tab>('students');
    const [currentUserId, setCurrentUserId] = useState<number>(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingRef     = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchChats();
        apiGetMe().then(me => setCurrentUserId(me.id));
        apiGetUsersByRole('student').then(setStudents).catch(() => {});
        apiGetUsersByRole('observer').then(setObservers).catch(() => {});
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
        const res = await apiTeacherGetChats().catch(() => []);
        setChats(res);
    };

    const fetchMessages = async (chatId: number) => {
        const res = await apiTeacherGetMessages(chatId).catch(() => []);
        setMessages(res);
    };

    const handleSelectChat = (chat: Chat) => {
        setSelectedChat(chat);
        setShowNewChat(false);
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        await apiTeacherSendMessage(selectedChat.id, newMessage.trim());
        setNewMessage("");
        fetchMessages(selectedChat.id);
    };

    const handleCreateChat = async (userId: number) => {
        const chat = await apiTeacherCreateChat(userId);
        await fetchChats();
        setShowNewChat(false);
        setSelectedChat(chat);
    };

    const getChatCompanion = (chat: Chat) =>
        chat.users.find(u => u.user.id !== currentUserId)?.user;

    const getLastMessage = (chat: Chat) =>
        chat.messages?.length > 0 ? chat.messages[0].content : "Нет сообщений";

    const currentUsers = activeTab === 'students' ? students : observers;
    const currentUserIds = new Set(currentUsers.map(u => u.id));
    const filteredChats = chats.filter(chat => {
        const companion = getChatCompanion(chat);
        return companion && currentUserIds.has(companion.id);
    });

    const avatarColor = activeTab === 'students'
        ? 'bg-blue-200 text-blue-700'
        : 'bg-purple-200 text-purple-700';

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <TeacherAside />
            <main className="flex-1 p-8">
                <DashboardHeader namePage="Чаты" />

                <div className="bg-white rounded-2xl shadow flex overflow-hidden" style={{ height: "75vh" }}>


                    <div className="w-72 flex flex-col bg-stone-200">

                        <div className="flex border-b border-stone-300">
                            <button
                                onClick={() => { setActiveTab('students'); setShowNewChat(false); setSelectedChat(null); }}
                                className={`flex-1 py-3 text-sm font-semibold transition ${
                                    activeTab === 'students'
                                        ? 'bg-white text-gray-800 border-b-2 border-stone-800'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Студенты
                            </button>
                            <button
                                onClick={() => { setActiveTab('observers'); setShowNewChat(false); setSelectedChat(null); }}
                                className={`flex-1 py-3 text-sm font-semibold transition ${
                                    activeTab === 'observers'
                                        ? 'bg-white text-gray-800 border-b-2 border-stone-800'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Наблюдатели
                            </button>
                        </div>

                        <div className="p-3">
                            <button
                                onClick={() => { setShowNewChat(!showNewChat); setSelectedChat(null); }}
                                className="w-full bg-neutral-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-neutral-700 transition"
                            >
                                + Новый чат
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {filteredChats.map(chat => {
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
                                                colorClass={avatarColor}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{companion?.fullName ?? "Неизвестно"}</p>
                                                <p className="text-gray-400 text-xs truncate">{getLastMessage(chat)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredChats.length === 0 && !showNewChat && (
                                <p className="text-gray-400 text-sm text-center mt-8 px-4">
                                    {activeTab === 'students' ? 'Нет чатов со студентами' : 'Нет чатов с наблюдателями'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">

                        {showNewChat && (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <h3 className="font-semibold text-lg mb-4">
                                    {activeTab === 'students' ? 'Выберите студента' : 'Выберите наблюдателя'}
                                </h3>
                                <div className="space-y-2">
                                    {currentUsers.length === 0 && (
                                        <p className="text-gray-400 text-sm">Никого нет</p>
                                    )}
                                    {currentUsers.map(u => (
                                        <div
                                            key={u.id}
                                            onClick={() => handleCreateChat(u.id)}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-stone-100 hover:bg-stone-200 cursor-pointer transition"
                                        >
                                            <UserAvatar
                                                url={u.avatarUrl}
                                                name={u.fullName}
                                                colorClass={avatarColor}
                                            />
                                            <span className="font-medium">{u.fullName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedChat && !showNewChat && (
                            <>
                                <div className="p-4 flex items-center gap-3 bg-stone-200">
                                    <UserAvatar
                                        url={getChatCompanion(selectedChat)?.avatarUrl}
                                        name={getChatCompanion(selectedChat)?.fullName ?? '?'}
                                        size="sm"
                                        colorClass={avatarColor}
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
                                                        colorClass={avatarColor}
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
                                        className="bg-black text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition"
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