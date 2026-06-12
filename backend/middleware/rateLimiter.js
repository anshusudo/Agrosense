function createRateLimiter({ windowMs = 60 * 1000, max = 60, message = 'Too many requests, please try again later.' } = {}) {
  const requestStore = new Map();

  return (req, res, next) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : (forwardedFor || req.ip || req.connection?.remoteAddress || 'unknown').toString().split(',')[0].trim();

    const now = Date.now();
    const windowStart = now - windowMs;

    const existingTimestamps = requestStore.get(ip) || [];
    const validTimestamps = existingTimestamps.filter((timestamp) => timestamp > windowStart);

    if (validTimestamps.length >= max) {
      return res.status(429).json({ msg: message });
    }

    validTimestamps.push(now);
    requestStore.set(ip, validTimestamps);

    return next();
  };
}

module.exports = { createRateLimiter };
