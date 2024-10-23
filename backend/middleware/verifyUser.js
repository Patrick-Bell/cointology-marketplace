require('dotenv').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const verifyUser = (req, res, next) => {
    // Check if the request contains cookies and a token
    if (!req.cookies || !req.cookies.token) {
        console.log('No token provided, proceeding as guest');
        req.user = { role: 'guest' }; // Assign a guest role
        return next(); // Proceed to the next middleware or route handler
    }

    // Verify the token
    jwt.verify(req.cookies.token, process.env.SESSION_SECRET, (err, user) => {
        if (err) {
            console.log('Invalid token:', err);
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = user; // Assign the user information from the token
        console.log(req.user)
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = verifyUser;
