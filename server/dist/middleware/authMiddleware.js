import { verifyToken } from '../utils/authUtils.js';
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
    }
};
