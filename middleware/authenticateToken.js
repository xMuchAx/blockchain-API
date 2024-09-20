import jwt from 'jsonwebtoken';
const SECRET_KEY = 'blockchain-jwt-key'; 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkVyd2FubkBleGFtcGxlLmNvbSIsImlhdCI6MTcyNjgxODEyNywiZXhwIjoxNzI2ODIxNzI3fQ.Kh8bF1yprTv_6h0bhDy0htTCPMZpM6YfL93Oo8OaTVk";
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

export default authenticateToken;
