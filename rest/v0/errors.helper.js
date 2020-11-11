
function createErrorJSON(status, error, message) {
    return {
        "timestamp": new Date().toUTCString(),
        "status": status,
        "error": error,
        "message": message
    };
}

module.exports = {createErrorJSON}