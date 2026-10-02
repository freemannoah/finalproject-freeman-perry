//DB User type
export interface UserDocument {
    user_id: string;
    username: string;
    passwordHash: string;
    display_name: string;
    residence?: string;
    created: Date;
}