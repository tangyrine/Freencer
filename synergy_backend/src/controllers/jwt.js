// jwt.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}

export function generateToken(user) {
    return jwt.sign(
        { id: user.user_id, email: user.email, name: user.name, phone: user.phone },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}



export function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: "Access denied, token missing" });
    }

    const cleanedToken = token.replace("Bearer ", "");
    
    try {
        const decoded = jwt.decode(cleanedToken, { complete: true });
        if (!decoded) {
            console.log("Invalid Token Structure");
            return res.status(403).json({ error: "Invalid token format" });
        }

        if (decoded.payload.exp && Date.now() >= decoded.payload.exp * 1000) {
            console.log("Token Expired");
            return res.status(401).json({ error: "Token expired" });
        }
        
        jwt.verify(cleanedToken, JWT_SECRET, (err, user) => {
            if (err) {
                console.log("Token Verification Failed:", err.message);
                return res.status(403).json({ error: "Invalid token" });
            }
            
            req.user = user;
            console.log("Token Verified. User:", user);
            next();
        });

    } catch (error) {
        console.log("Token Parsing Error:", error);
        return res.status(403).json({ error: "Invalid token" });
    }
}

