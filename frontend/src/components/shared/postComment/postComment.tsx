import { useEffect, useState } from 'react';
import { type PostComment } from './types';
import {
    apiGetComments,
    apiCreateComment,
    apiReplyComment,
    apiDeleteComment,
} from '../../../api/shared/postComment';

// ─── Аватар ───────────────────────────────────────────────────────────
function Avatar({ name, url }: { name: string; url: string | null }) {
    if (url) {
        return <img src={url} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
    }
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-xs font-bold">{initials}</span>
        </div>
    );
}

// ─── Форма отправки ───────────────────────────────────────────────────
function CommentInput({ placeholder, onSubmit, loading }: {
    placeholder: string;
    onSubmit: (text: string) => Promise<void>;
    loading: boolean;
}) {
    const [text, setText] = useState('');

    const handleSubmit = async () => {
        if (!text.trim()) return;
        await onSubmit(text.trim());
        setText('');
    };

    return (
        <div className="flex gap-2">
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder={placeholder}
                className="flex-1 bg-stone-100 rounded-lg px-4 py-2 text-sm focus:outline-none hover:bg-stone-200 transition"
            />
            <button
                disabled={!text.trim() || loading}
                onClick={handleSubmit}
                className="px-4 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {loading ? '...' : 'Отправить'}
            </button>
        </div>
    );
}

// ─── Один комментарий ─────────────────────────────────────────────────
function CommentItem({ comment, canReply, canDelete, onReply, onDelete }: {
    comment: PostComment;
    canReply: boolean;
    canDelete: (authorId: number) => boolean;
    onReply: (commentId: number, text: string) => Promise<void>;
    onDelete: (commentId: number) => Promise<void>;
}) {
    const [showReply, setShowReply] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);

    const handleReply = async (text: string) => {
        setReplyLoading(true);
        try {
            await onReply(comment.id, text);
            setShowReply(false);
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Корневой комментарий */}
            <div className="flex gap-3">
                <Avatar name={comment.author.fullName} url={comment.author.avatarUrl} />
                <div className="flex-1">
                    <div className="bg-stone-50 rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800">
                                {comment.author.fullName}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleString('ru-RU', {
                                    day: '2-digit', month: '2-digit',
                                    hour: '2-digit', minute: '2-digit',
                                })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>

                    {/* Действия */}
                    <div className="flex gap-3 mt-1 px-1">
                        {canReply && (
                            <button
                                onClick={() => setShowReply(v => !v)}
                                className="text-xs text-gray-400 hover:text-gray-600 transition"
                            >
                                Ответить
                            </button>
                        )}
                        {canDelete(comment.author.id) && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="text-xs text-red-400 hover:text-red-600 transition"
                            >
                                Удалить
                            </button>
                        )}
                    </div>

                    {/* Форма ответа */}
                    {showReply && (
                        <div className="mt-2">
                            <CommentInput
                                placeholder="Напишите ответ..."
                                onSubmit={handleReply}
                                loading={replyLoading}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Ответы учителя */}
            {comment.replies.map(reply => (
                <div key={reply.id} className="flex gap-3 ml-11">
                    <Avatar name={reply.author.fullName} url={reply.author.avatarUrl} />
                    <div className="flex-1">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-blue-800">
                                    {reply.author.fullName}
                                    <span className="ml-2 text-xs font-normal text-blue-400">учитель</span>
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(reply.createdAt).toLocaleString('ru-RU', {
                                        day: '2-digit', month: '2-digit',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                        {canDelete(reply.author.id) && (
                            <div className="mt-1 px-1">
                                <button
                                    onClick={() => onDelete(reply.id)}
                                    className="text-xs text-red-400 hover:text-red-600 transition"
                                >
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Главный компонент ────────────────────────────────────────────────
interface PostCommentsProps {
    postId: number;
    currentUserId: number;
    role: 'student' | 'teacher';
}

export function PostComments({ postId, currentUserId, role }: PostCommentsProps) {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState<string | null>(null);

    const load = () => {
        apiGetComments(postId)
            .then(setComments)
            .catch(e => setError(e.message));
    };

    useEffect(() => { load(); }, [postId]);

    const handleCreate = async (text: string) => {
        setLoading(true);
        try {
            const comment = await apiCreateComment(postId, text);
            setComments(prev => [...prev, comment]);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (commentId: number, text: string) => {
        const reply = await apiReplyComment(postId, commentId, text);
        setComments(prev => prev.map(c =>
            c.id === commentId
                ? { ...c, replies: [...c.replies, reply] }
                : c
        ));
    };

    const handleDelete = async (commentId: number) => {
        await apiDeleteComment(commentId);
        // Удаляем корневой или вложенный
        setComments(prev =>
            prev
                .filter(c => c.id !== commentId)
                .map(c => ({ ...c, replies: c.replies.filter(r => r.id !== commentId) }))
        );
    };

    const canDelete = (authorId: number) => authorId === currentUserId;

    return (
        <div className="border-t pt-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Комментарии {comments.length > 0 && `(${comments.length})`}
            </h2>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {comments.length === 0 && (
                <p className="text-sm text-gray-400">Комментариев пока нет</p>
            )}

            <div className="space-y-4">
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        canReply={role === 'teacher'}
                        canDelete={canDelete}
                        onReply={handleReply}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Форма нового комментария — только студент */}
            {role === 'student' && (
                <CommentInput
                    placeholder="Напишите вопрос или комментарий..."
                    onSubmit={handleCreate}
                    loading={loading}
                />
            )}
        </div>
    );
}