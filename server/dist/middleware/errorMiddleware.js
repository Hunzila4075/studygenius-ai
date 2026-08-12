export const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Error:', err.message || err);
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Something went wrong. Please try again.',
    });
};
