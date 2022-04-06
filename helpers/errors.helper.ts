import { Error as ErrorType } from "../types/types";

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError"
    }
}

export function createErrorJSON(status: number, error: string, message: string) : ErrorType {
    return {
        "timestamp": new Date().toUTCString(),
        "status": status,
        "error": error,
        "message": message
    };
}

