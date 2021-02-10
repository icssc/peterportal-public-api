
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError"
    }
}

function createErrorJSON(status, error, message) {
    return {
        "timestamp": new Date().toUTCString(),
        "status": status,
        "error": error,
        "message": message
    };
}

module.exports = {createErrorJSON, ValidationError}