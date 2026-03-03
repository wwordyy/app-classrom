export interface CommentAuthor {
    id: number;
    fullName: string;
    avatarUrl: string | null;
}

export interface CommentReply {
    id: number;
    content: string;
    createdAt: string;
    author: CommentAuthor;
}

export interface PostComment {
    id: number;
    content: string;
    createdAt: string;
    author: CommentAuthor;
    replies: CommentReply[];
}