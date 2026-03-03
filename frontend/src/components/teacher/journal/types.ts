export type JournalStudent = {
    id: number;
    fullName: string;
    email: string;
}

export type JournalStudentList = {
    groupName: string;
    students: JournalStudent[];
}

export type JournalPost = {
    id: number;
    title: string;
    dueDate: string;
    maxScore: number;
    typePost: string;
    grade: number | null;
    feedBackTeacher: string | null;
    status: string;
    submittedAt: string | null;
}

export type StudentGrades = {
    groupName: string;
    groupId: number;
    student: JournalStudent;
    posts: JournalPost[];
}