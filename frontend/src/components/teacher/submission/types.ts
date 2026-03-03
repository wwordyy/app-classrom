export interface Student {
    id: number;
    fullName: string;
    email: string;
}

export interface Submission {
    id: number;
    fileUrl: string | null;
    grade: number | null;
    submittedAt: string | null;
    feedBackTeacher: string | null;
    statusSubmission: TypeSubmission;
    student: Student;
}

export interface PostWithSubmissions {
    id: number;
    title: string;
    content: string;
    dueDate: string;
    maxScore: number;
    fileUrl: string | null;
    typePost: { id: number; title: string };
    submissions: Submission[];
}


export interface TypeSubmission {

    id: number,
    title: string
}


export interface updSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (grade: number, comment: string) => void;
    studentName: string;
    currentGrade?: number | null;
    currentComment?: string | null;
}