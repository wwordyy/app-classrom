export interface GroupsOverview {
    id: number,
    name: string, 
    courseYear: number,
    studentsCount: number,
    teacher: {
        id: number,
        fullName: string,
    }
}