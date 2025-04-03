// main.mjs
import redisClient from './utils/redis.mjs';

(async () => {
  // Assure-toi que Redis est bien prêt avant d'interagir avec
  const isRedisAlive = await redisClient.isAlive();
  console.log(isRedisAlive); // true ou false

  if (!isRedisAlive) {
    console.error('Redis is not connected.');
    return;
  }

  console.log(await redisClient.get('myKey'));
  await redisClient.set('myKey', 12, 5);
  console.log(await redisClient.get('myKey'));

  setTimeout(async () => {
    console.log(await redisClient.get('myKey'));
  }, 10000);
})();
