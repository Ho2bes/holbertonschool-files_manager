// main.js
import redisClient from './utils/redis.mjs';

(async () => {
  // Vérifie si Redis est bien connecté
  console.log(redisClient.isAlive()); // Affiche true si la connexion est active

  // Essaie de récupérer une clé qui n'existe pas encore
  console.log(await redisClient.get('myKey')); // Affiche null

  // Stocke une clé avec une durée de 5 secondes
  await redisClient.set('myKey', 12, 5);
  console.log(await redisClient.get('myKey')); // Affiche 12

  // Attends 10 secondes, puis essaie de lire la clé (elle a expiré)
  setTimeout(async () => {
    console.log(await redisClient.get('myKey')); // Affiche null
  }, 10000); // 10 secondes
})();
