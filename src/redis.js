const { createClient } = require('redis');
const logger = require('./logger');

// URL can be set via env var, defaults to localhost for local dev
// In docker-compose, hostname is 'redis'
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({
  url: redisUrl
});

client.on('error', (err) => {
    // Suppress errors if Redis is not available to avoid spamming logs in non-redis envs
    // logger.warn('Redis Client Error', { error: err.message });
});

client.on('connect', () => logger.info('Redis Client Connected'));

// Connect immediately
(async () => {
  try {
    await client.connect();
  } catch (err) {
    logger.warn('Initial Redis connection failed', { error: err.message });
  }
})();

module.exports = client;
