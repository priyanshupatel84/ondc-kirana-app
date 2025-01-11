const jwt = require('jsonwebtoken');
require('dotenv').config();
const  JWT_SECRET  = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Failed:', error.message); // Logs specific error
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticate };
