export interface Role {
  id: number;
  title: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  role: Role;
  studentGroup?: Group | null;
  teachingGroups?: Group[];
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface GroupTeacher {
  id: number;
  fullName: string;
  email: string;
}

export interface GroupItem {
  id: number;
  name: string;
  courseYear: number;
  specialty: string;
  teacher?: GroupTeacher | null;
  _count?: { students: number };
}

export interface GroupDetail extends GroupItem {
  students: { id: number; fullName: string; email: string; isActive: boolean }[];
}

export interface GroupListResponse {
  data: GroupItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ResponseError {
  error: string;
}