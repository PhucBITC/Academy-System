interface IUser {
    personId : number;
    name : string;
    mobileNumber : string;
    email: string;
    urlAvt : string;
    roles : IRole;
}

interface IRole {
    roleName: string;
}
interface ICourse {
    courseId: number;
    courseTitle: string;
    originalPrice: string;
    price: string;
    level: string;
    category: string;
    languagesProgramming: string;
    urlImg: string;
    des: string;
}

interface ICart {
    course : ICourse,
    selected : boolean
}

interface ICourseWithRating {
    course: ICourse; 
    rating: number; 
}
interface ICourseAI{
    courseId: number;
    courseTitle: string;
}

interface IComment {
    commentId : number | null;
    content : string;
    createdAt : Date;
    person : IUser;
    parent : IComment | null;
}

interface IUserRating{
    id: {
        personId: number;
    }
    rating: number;
}


interface IContext {
    user: IUser | null;
    cards: ICart[] | null;
    updateCards: (newCards: ICart[]) => void; 
}

