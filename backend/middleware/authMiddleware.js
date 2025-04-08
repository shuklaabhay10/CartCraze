const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded); // Debugging output

            // Use decoded.user.id instead of decoded.id
            req.user = await User.findById(decoded.user.id).select('-password');
            console.log("User attached to req:", req.user); // Debugging output

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// middleware to check if the user is an admin
const admin = (req,res,next) =>{
    if (req.user && req.user.role === 'admin'){
        next()
    } else {
        res.status(403).json({message: "not authorized as an admin"})
    }
}

module.exports = {protect,admin};
