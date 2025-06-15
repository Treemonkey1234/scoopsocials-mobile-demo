import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { redis } from '../server';

const router = express.Router();

// Simple JWT token generation
const generateTokens = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';
  
  const accessToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

// GET /api/auth/health
router.get('/health', (req, res) => {
  res.json({ status: 'Auth service OK', timestamp: new Date().toISOString() });
});

// POST /api/auth/test-signup
router.post('/test-signup', async (req, res) => {
  try {
    const { phone, name, username } = req.body;
    
    if (!phone || !name || !username) {
      return res.status(400).json({ error: 'Phone, name, and username required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        phone,
        name,
        username,
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
        onboardingComplete: true,
        accountType: 'FREE'
      }
    });

    // Generate tokens
    const tokens = generateTokens(newUser.id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        phone: newUser.phone,
        accountType: newUser.accountType,
        trustScore: newUser.trustScore
      },
      ...tokens
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;