import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default class AppController {
  static async getStatus(req, res) {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();

    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats(req, res) {
    const nUsers = await dbClient.nbUsers();
    const nFiles = await dbClient.nbFiles();

    res.status(200).json({ users: nUsers, files: nFiles });
  }
}
