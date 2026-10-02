//Message DTO
export interface Message {
    message_id: string;
    post_id: string;
    sender_id: string;
    recipient_id: string;
    body: string;
    time: string;
    imageData?: string;
}