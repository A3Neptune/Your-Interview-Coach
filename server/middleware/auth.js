import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    // Allow both students and professionals, but not for pure student routes
    if (req.user.userType !== 'student' && req.user.userType !== 'professional' && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Invalid user type' });
    }
    next();
  });
};

export const verifyMentor = (req, res, next) => {
  verifyToken(req, res, () => {
    // Only admin users are mentors
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Mentor access required' });
    }
    next();
  });
};

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token; // Store token for audit logging
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        expiredAt: err.expiredAt,
        code: 'TOKEN_EXPIRED'
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.userType !== requiredRole && req.user.userType !== 'admin') {
      return res.status(403).json({ error: `${requiredRole} access required` });
    }

    next();
  };
};
