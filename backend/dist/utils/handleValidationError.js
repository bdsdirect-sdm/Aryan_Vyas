"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
// This function handles validation errors and returns the appropriate status and error message
const handleValidationError = (error, res) => {
    // Check if error exists and has details
    if (error && error.details && error.details[0]) {
        // Extract the error message from Joi validation
        const errorMessage = error.details[0].message;
        // Determine the status code dynamically (you can customize this logic based on error type)
        const statusCode = errorMessage.includes("required") ? 400 : 422; // Adjust based on message content
        // Return the response with the error message and status code
        return res.status(statusCode).json({
            error: errorMessage,
        });
    }
    // If no validation error details, return a 400 Bad Request by default
    return res.status(400).json({
        error: 'Invalid request data',
    });
};
exports.handleValidationError = handleValidationError;
