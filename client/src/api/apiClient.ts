export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

/**
 * The browser's authentication cookie is automatically included because credentials are set to "include".
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    let body: unknown;

    try {
        body = await response.json();
    } catch {
        body = undefined;
    }

    if (!response.ok) {
        let message = `Request failed with status ${response.status}.`;

        if (
            body &&
            typeof body === "object" &&
            "message" in body &&
            typeof body.message === "string"
        ) {
            message = body.message;
        }

        throw new ApiError(response.status, message);
    }

    return body as T;
}