//Message DTO
export interface Message {
    message_id: number
    post_id: number
    sender_id: number
    senderDisplayName: string
    recipient_id: number
    recipientDisplayName: string
    body: string
    time: string
    imageData?: string
}