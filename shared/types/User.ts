//User DTOs
export interface User {
    user_id: number;
    username: string;
    password: string;
    display_name: string;
    residence?: string;
    created: string;
}

export interface SimpleUser {
    user_id: number;
    display_name: string;
    residence?: string;
    created: string;
}