export interface TypePost {
  id: number;
  title: string;
}

export interface Submission {
  id: number;
  fileUrl: string | null;
  grade: number | null;
  submittedAt: string | null;
  feedBackTeacher: string | null;
  updatedAt: string;
  statusSubmissionId: number;
  postId: number;
  userId: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  dueDate: string;
  maxScore: number;
  groupId: number;
  typePostId: number;

  typePost: TypePost;       
  submissions: Submission[];

  totalSubmissions: number;  
  submittedCount: number;
}

export interface Student {
  id: number;
  fullName: string;
  email: string;
}

export interface TeacherGroupDashboard {
  id: number;
  name: string;
  courseYear: number;
  specialty: string;
  teacherId: number | null;

  students: Student[];
  posts: Post[];
}