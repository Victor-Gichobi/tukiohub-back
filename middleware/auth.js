import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// 1. SIGNING A TOKEN (Create token after user logs in)
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };

  // Signs the token using HS256 by default; expires in 1 hour
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// 2. VERIFYING A TOKEN (Middleware to protect your API routes)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expected format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach decoded user data to the request object
    req.user = decodedUser;
    next();
  });
}

// --- Quick Usage Example ---
const mockUser = { id: 123, email: 'user@example.com' };
const token = generateToken(mockUser);
console.log('Generated JWT:', token);
