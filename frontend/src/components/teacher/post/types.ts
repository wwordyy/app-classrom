

export interface CreatePostPayload {
  title: string;
  content: string;
  dueDate?: string;
  maxScore?: number;
  groupId: number;
  typePostId: number;
  file?: File | null;
  weeks?: string; 
}

export interface TypePost {
    id: number;
    title: string;
}
