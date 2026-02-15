import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบ',
      message_en: 'Authentication required',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง',
        message_en: 'Session expired, please login again',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Token ไม่ถูกต้อง',
      message_en: 'Invalid token',
    });
  }
};

export default authMiddleware;
