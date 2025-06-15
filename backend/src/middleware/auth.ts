import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    phone: string;
    accountType: string;
    trustScore: number;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({ 
        error: 'Server configuration error',
        code: 'CONFIG_ERROR'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { 
        userId: string; 
        iat: number; 
        exp: number; 
      };

      // Fetch user from database to ensure they still exist and get latest data
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          phone: true,
          accountType: true,
          accountStatus: true,
          trustScore: true,
          phoneVerified: true
        }
      });

      if (!user) {
        return res.status(401).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (user.accountStatus !== 'ACTIVE') {
        return res.status(403).json({ 
          error: 'Account suspended or deactivated',
          code: 'ACCOUNT_INACTIVE'
        });
      }

      if (!user.phoneVerified) {
        return res.status(403).json({ 
          error: 'Phone number not verified',
          code: 'PHONE_NOT_VERIFIED'
        });
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email || undefined,
        phone: user.phone,
        accountType: user.accountType,
        trustScore: user.trustScore
      };

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          error: 'Invalid token',
          code: 'TOKEN_INVALID'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Middleware to check if user has specific account type
export const requireAccountType = (requiredTypes: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!requiredTypes.includes(req.user.accountType)) {
      return res.status(403).json({ 
        error: `Account type ${req.user.accountType} not authorized. Required: ${requiredTypes.join(', ')}`,
        code: 'INSUFFICIENT_ACCOUNT_TYPE'
      });
    }

    next();
  };
};

// Middleware to check if user has minimum trust score
export const requireMinTrustScore = (minScore: number) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (req.user.trustScore < minScore) {
      return res.status(403).json({ 
        error: `Minimum trust score of ${minScore} required. Your score: ${req.user.trustScore}`,
        code: 'INSUFFICIENT_TRUST_SCORE'
      });
    }

    next();
  };
};

// Middleware for moderators
export const requireModerator = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user has moderator privileges
    // In a real system, you'd have a separate moderators table or role system
    // For now, we'll use a simple check: VENUE accounts with high trust scores can moderate
    const isModerator = req.user.accountType === 'VENUE' && req.user.trustScore >= 85;
    
    if (!isModerator) {
      return res.status(403).json({ 
        error: 'Moderator privileges required',
        code: 'MODERATOR_REQUIRED'
      });
    }

    next();
  } catch (error) {
    logger.error('Moderator check error:', error);
    return res.status(500).json({ 
      error: 'Authorization check failed',
      code: 'AUTH_CHECK_ERROR'
    });
  }
};

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // Continue without auth
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return next(); // Continue without auth if JWT not configured
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          phone: true,
          accountType: true,
          accountStatus: true,
          trustScore: true,
          phoneVerified: true
        }
      });

      if (user && user.accountStatus === 'ACTIVE' && user.phoneVerified) {
        req.user = {
          id: user.id,
          email: user.email || undefined,
          phone: user.phone,
          accountType: user.accountType,
          trustScore: user.trustScore
        };
      }
    } catch (jwtError) {
      // Silent fail for optional auth
      logger.debug('Optional auth failed:', jwtError);
    }

    next();
  } catch (error) {
    logger.error('Optional auth error:', error);
    next(); // Continue even if there's an error
  }
};