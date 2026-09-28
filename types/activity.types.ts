export interface Activity {
    _id?: string;
    title: string,
    description: string,
    objective:string ,
    difficulty:string ,
    status: boolean,
    createdAt: Date,
    updatedAt: Date,
    teacherId: String
}
