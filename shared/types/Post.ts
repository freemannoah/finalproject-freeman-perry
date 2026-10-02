import { Message } from "./Message";

//Post DTOs
export interface SimplePost {
    post_id: string;
    user_id: string;
    title: string;
    isResolved: boolean;
    imageData?: string;
}

export interface Post extends SimplePost {
    description: string;
    messages: Message[];
}