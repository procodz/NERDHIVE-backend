export class ResponseHelper {
    static responseHandler(statusCode, status, message, data) {
        return {
            statusCode,
            status,
            message,
            data
        };
    }
}