export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    rankings: { [key: string]: any };
    createdAt?: Date;
}

export class UserUtil {
    static toJSON(user: User): any {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            rankings: user.rankings,
            createdAt: user.createdAt
        };
    }
}
