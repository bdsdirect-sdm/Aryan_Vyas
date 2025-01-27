"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCodes = void 0;
exports.statusCodes = {
    success: {
        OK: { code: 200, message: 'OK' },
    },
    error: {
        UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
        SERVER_ERROR: { code: 500, message: 'Internal Server Error' },
        BAD_REQUEST: { code: 400, message: 'Bad Request' },
        UNPROCESSABLE_ENTITY: { code: 422, message: 'Unprocessable Entity' },
        NOT_FOUND: { code: 422, message: 'Unprocessable Entity' },
        FORBIDDEN: { code: 403, message: 'Forbidden' },
    },
};
