import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

export class RedisClient {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    this.client.on('end', () => {
      logger.info('Redis Client Disconnected');
      this.isConnected = false;
    });

    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping get operation');
        return null;
      }
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping set operation');
        return false;
      }
      
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping delete operation');
        return false;
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    try {
      if (!this.isConnected) {
        return 0;
      }
      
      const result = await this.client.incr(key);
      
      if (ttlSeconds && result === 1) {
        await this.client.expire(key, ttlSeconds);
      }
      
      return result;
    } catch (error) {
      logger.error('Redis INCR error:', error);
      return 0;
    }
  }

  async setJson(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      return await this.set(key, JSON.stringify(value), ttlSeconds);
    } catch (error) {
      logger.error('Redis SET JSON error:', error);
      return false;
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis GET JSON error:', error);
      return null;
    }
  }

  // Phone verification specific methods
  async setPhoneVerificationCode(phone: string, code: string): Promise<boolean> {
    const key = `phone_verification:${phone}`;
    return await this.set(key, code, 300); // 5 minutes TTL
  }

  async getPhoneVerificationCode(phone: string): Promise<string | null> {
    const key = `phone_verification:${phone}`;
    return await this.get(key);
  }

  async deletePhoneVerificationCode(phone: string): Promise<boolean> {
    const key = `phone_verification:${phone}`;
    return await this.del(key);
  }

  // Rate limiting methods
  async checkRateLimit(identifier: string, maxRequests: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const current = await this.increment(key, windowSeconds);
    
    const remaining = Math.max(0, maxRequests - current);
    const allowed = current <= maxRequests;
    const resetTime = Date.now() + (windowSeconds * 1000);
    
    return { allowed, remaining, resetTime };
  }

  // Session management
  async setUserSession(userId: string, sessionData: any): Promise<boolean> {
    const key = `session:${userId}`;
    return await this.setJson(key, sessionData, 24 * 60 * 60); // 24 hours
  }

  async getUserSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    return await this.getJson(key);
  }

  async deleteUserSession(userId: string): Promise<boolean> {
    const key = `session:${userId}`;
    return await this.del(key);
  }

  // Flag submission tracking
  async incrementDailyFlags(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_flags:${userId}:${today}`;
    const ttl = 24 * 60 * 60; // 24 hours
    return await this.increment(key, ttl);
  }

  async getDailyFlagCount(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_flags:${userId}:${today}`;
    const count = await this.get(key);
    return count ? parseInt(count) : 0;
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      logger.info('Redis client disconnected');
    } catch (error) {
      logger.error('Error disconnecting Redis client:', error);
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  isReady(): boolean {
    return this.isConnected;
  }
}