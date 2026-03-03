export interface PracticeResult {
    grade: number;
    comment: string | null;
    gradedAt: string;
    teacher: string;
}

export interface PracticePost {
    id: number;
    title: string;
    dueDate: string;
    maxScore: number | null;
    typePost: string | null;
    grade: number | null;
    status: string;
    submittedAt: string | null;
}

export interface PracticeInfo {
    practiceResult: PracticeResult | null;
    posts: PracticePost[];
}