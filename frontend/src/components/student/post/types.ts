export interface StatusSubmission {
    id: number;
    title: string;
}

export interface Submission {
    id: number;
    grade: number | null;
    submittedAt: string | null;
    feedBackTeacher: string | null;
    fileUrl: string | null;
    statusSubmission: StatusSubmission;
}

export interface DocumentPart {
    id: number;
    fileUrl: string;
    documentType: {
        id: number;
        title: string;
        orderIndex: number;
    };
}

export interface TypePost {
    id: number;
    title: string;
}

// Полный пост (детальная страница)
export interface StudentPost {
    id: number;
    title: string;
    content: string;

    // для Задания и Итоговой практики
    dueDate?: string;
    maxScore?: number;

    fileUrl: string | null;
    isFinal: boolean;

    // Тип поста
    typePost: TypePost | null;

    // Только для постов с заданиями
    submission?: Submission | null;

    // Для дневника
    weeks?: {
        week: number;
        goal: string;
    }[]; 

    documentParts: DocumentPart[];
}

// Список постов (без documentParts)
export interface StudentPostListItem {
    id: number;
    title: string;
    content: string;

    dueDate?: string;
    maxScore?: number;

    fileUrl: string | null;
    isFinal: boolean;

    typePost: TypePost | null;
    submission?: Submission | null;

    // Для дневника
    weeks?: {
        week: number;
        goal: string;
    }[];
}