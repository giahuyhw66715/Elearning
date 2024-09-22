export interface IDepartment {
    _id?: string;
    name: string;
}

export interface IAssignment {
    _id?: string;
    title: string;
    instructions?: string;
    dueDate?: Date | string;
    attachment?: string;
    course: ICourse | string;
    submissions?: ISubmission[];
    createdAt?: Date | string;
}

export interface ISubmission {
    _id?: string;
    assignment: IAssignment | string;
    student: IUser | string;
    file: string;
    grade?: number;
    createdAt?: Date | string;
}

export interface ICourse {
    _id?: string;
    title: string;
    image: string;
    department: IDepartment | string;
    lecturer: IUser | string;
    students?: IUser[] | string[];
    assignments?: IAssignment[];
}

export interface ILogin {
    username: string;
    password: string;
}

export interface IUser extends Partial<ILogin> {
    _id?: string;
    email: string;
    fullName: string;
    avatar?: string;
    department: IDepartment | string;
    courses?: ICourse[];
    role: Role;
}

export type Token = {
    accessToken: string;
    refreshToken: string;
};

export type ErrorMessage = {
    response: {
        data: {
            message: string;
        };
    };
};

export enum Role {
    admin = "admin",
    student = "student",
    lecturer = "lecturer",
}

export type FileUploadResult = {
    tempUrl: string;
    file: File | undefined;
};
