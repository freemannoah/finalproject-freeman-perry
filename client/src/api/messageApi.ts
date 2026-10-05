import type { SimpleResponse } from "../../../shared/types/SimpleResponse";
import type { Message } from "../../../shared/types/Message";
import { apiRequest } from "./apiClient";

/**
 * POST /message
 *
 * Sends a message associated with a post.
 */
export async function sendMessage(message: Message): Promise<SimpleResponse<Message>> {
    return apiRequest<SimpleResponse<Message>>(
        "/message",
        {
            method: "POST",
            body: JSON.stringify(message),
        }
    );
}