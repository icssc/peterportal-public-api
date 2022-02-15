
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError"
    }
}

export function createErrorJSON(status, error, message) {
    return {
        "timestamp": new Date().toUTCString(),
        "status": status,
        "error": error,
        "message": message
    };
}

