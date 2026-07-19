import { Redis } from '@upstash/redis';

export const redisClient = Redis.fromEnv();

export const createUpstashStore = (prefix, windowInSeconds = 60) => ({
  increment: async (key) => {
    const fullKey = `${prefix}${key}`;

    const p = redisClient.pipeline();
    p.incr(fullKey);
    p.ttl(fullKey);
    const [currentCount, ttl] = await p.exec();

    if (currentCount === 1 || ttl < 0) {
      await redisClient.expire(fullKey, windowInSeconds);
    }

    return {
      totalHits: currentCount,
      resetTime: new Date(Date.now() + (ttl < 0 ? windowInSeconds : ttl) * 1000),
    };
  },
  decrement: async (key) => {
    await redisClient.decr(`${prefix}${key}`);
  },
  resetKey: async (key) => {
    await redisClient.del(`${prefix}${key}`);
  },
});

export default createUpstashStore;
