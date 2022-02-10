
require('dotenv').config();

const redis = require('redis');


const cacheAddress = process.env.CACHE_HOST || "127.0.0.1";
const port = process.env.PORT || 8080;
const PORT_REDIS = process.env.PORT || 6379;

let redisClient;
(async () => {
    redisClient = redis.createClient();
  
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
  
    await redisClient.connect();
  
    await redisClient.set('key', 'value');
    const value = await redisClient.get('key');
    console.log(value);
})();

module.exports = redisClient