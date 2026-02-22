export interface User {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}

export interface Chat {
  id: number;
  users: { user: User }[];
  messages: Message[];
}