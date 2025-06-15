import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../server';
import { redis } from '../server';
import { logger } from '../utils/logger';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { ValidationError, NotFoundError, UnauthorizedError, RateLimitError } from '../middleware/errorHandler';
import { sendSMS } from '../services/smsService';
import { generateVerificationCode } from '../utils/helpers';

const router = express.Router();

// Validation schemas
const phoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Use international format (+1234567890)')
});

const verifyPhoneSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  code: z.string().length(6, 'Verification code must be 6 digits')
});

const signupSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email().optional(),
  accountType: z.enum(['FREE', 'PROFESSIONAL', 'VENUE']).default('FREE'),
  bio: z.string().max(500).optional(),
  location: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string()
  }).optional(),
  occupation: z.string().max(100).optional(),
  interests: z.array(z.string().max(50)).max(10).optional()
});

const loginSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  password: z.string().min(1, 'Password required').optional()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required')
});

// Rate limiting helper
const checkAuthRateLimit = async (identifier: string): Promise<void> => {
  const rateLimit = await redis.checkRateLimit(`auth:${identifier}`, 5, 300); // 5 attempts per 5 minutes
  if (!rateLimit.allowed) {
    throw new RateLimitError('Too many authentication attempts. Please try again later.');
  }
};

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const payload = { userId };
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE_TIME || '24h' }
  );
  
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// POST /api/auth/send-verification
router.post('/send-verification', async (req, res, next) => {
  try {
    const { phone } = phoneSchema.parse(req.body);
    
    // Rate limiting
    await checkAuthRateLimit(phone);
    
    // Generate and store verification code
    const code = generateVerificationCode();
    await redis.setPhoneVerificationCode(phone, code);
    
    // Send SMS
    await sendSMS(phone, `Your ScoopSocials verification code is: ${code}`);
    
    logger.info(`Verification code sent to ${phone}`);
    
    res.json({
      message: 'Verification code sent successfully',
      expiresIn: 300 // 5 minutes
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify-phone
router.post('/verify-phone', async (req, res, next) => {
  try {
    const { phone, code } = verifyPhoneSchema.parse(req.body);
    
    // Check verification code
    const storedCode = await redis.getPhoneVerificationCode(phone);
    if (!storedCode || storedCode !== code) {
      throw new ValidationError('Invalid or expired verification code');
    }
    
    // Remove used verification code
    await redis.deletePhoneVerificationCode(phone);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
      select: { id: true, phoneVerified: true, name: true, username: true }
    });
    
    if (existingUser) {
      // Update phone verification status if not already verified
      if (!existingUser.phoneVerified) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { phoneVerified: true, phoneVerifiedAt: new Date() }
        });
      }
      
      // Generate tokens for existing user
      const tokens = generateTokens(existingUser.id);
      
      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: existingUser.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });
      
      res.json({
        message: 'Phone verified successfully',
        user: {
          id: existingUser.id,
          name: existingUser.name,
          username: existingUser.username,
          phone,
          isNewUser: false
        },
        ...tokens
      });
    } else {
      res.json({
        message: 'Phone verified successfully',
        phone,
        isNewUser: true,
        requiresSignup: true
      });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const userData = signupSchema.parse(req.body);
    
    // Verify phone was recently verified (check if verification happened in last 10 minutes)
    const recentVerification = await redis.get(`phone_verified:${userData.phone}`);
    if (!recentVerification) {
      throw new ValidationError('Phone number must be verified before signup');
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: userData.phone },
          { username: userData.username },
          ...(userData.email ? [{ email: userData.email }] : [])
        ]
      }
    });
    
    if (existingUser) {
      if (existingUser.phone === userData.phone) {
        throw new ValidationError('Phone number already registered');
      }
      if (existingUser.username === userData.username) {
        throw new ValidationError('Username already taken');
      }
      if (userData.email && existingUser.email === userData.email) {
        throw new ValidationError('Email already registered');
      }
    }
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
        onboardingComplete: true,
        location: userData.location || undefined,
        interests: userData.interests || []
      },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        accountType: true,
        trustScore: true,
        bio: true,
        location: true,
        occupation: true,
        interests: true
      }
    });
    
    // Generate tokens
    const tokens = generateTokens(newUser.id);
    
    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    // Clean up verification status
    await redis.del(`phone_verified:${userData.phone}`);
    
    logger.info(`New user created: ${newUser.id} (${newUser.username})`);
    
    res.status(201).json({
      message: 'Account created successfully',
      user: newUser,
      ...tokens
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { phone } = loginSchema.parse(req.body);
    
    // Rate limiting
    await checkAuthRateLimit(phone);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        accountType: true,
        accountStatus: true,
        phoneVerified: true,
        trustScore: true,
        bio: true,
        location: true,
        occupation: true,
        interests: true,
        onboardingComplete: true
      }
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.accountStatus !== 'ACTIVE') {
      throw new UnauthorizedError('Account is suspended or deactivated');
    }
    
    if (!user.phoneVerified) {
      throw new UnauthorizedError('Phone number not verified');
    }
    
    // For phone-only auth, we'll send a verification code
    // In a production app, you might want password auth as well
    res.json({
      message: 'User found. Please verify your phone number to continue.',
      requiresPhoneVerification: true,
      userId: user.id
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };
    
    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });
    
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
    
    if (storedToken.user.accountStatus !== 'ACTIVE') {
      throw new UnauthorizedError('Account is suspended or deactivated');
    }
    
    // Generate new tokens
    const tokens = generateTokens(storedToken.userId);
    
    // Delete old refresh token and create new one
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    res.json({
      message: 'Tokens refreshed successfully',
      ...tokens
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (token) {
      // In a production app, you might want to blacklist the access token
      // For now, we'll just remove refresh tokens
      await prisma.refreshToken.deleteMany({
        where: { userId: req.user!.id }
      });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        accountType: true,
        trustScore: true,
        bio: true,
        avatar: true,
        location: true,
        occupation: true,
        interests: true,
        onboardingComplete: true,
        professionalLayerEnabled: true,
        isOnline: true,
        lastSeen: true,
        joinDate: true,
        phoneVerified: true
      }
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;