import type { Message } from "./Message";

//Post DTOs
export interface SimplePost {
    post_id: number;
    user_id: number;
    userDisplayName: string;
    title: string;
    isResolved: boolean;
    created: string;
    imageData?: string;
}

export interface Post extends SimplePost {
    description: string;
    messages: Message[];
}