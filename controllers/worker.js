// worker.js
import { promisify } from 'util';
import { createClient } from 'redis';
import { MongoClient, ObjectId } from 'mongodb';
import Bull from 'bull';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import path from 'path';

const fileQueue = new Bull('fileQueue');
const redisClient = createClient();
const redisGetAsync = promisify(redisClient.get).bind(redisClient);

const dbClient = new MongoClient(process.env.DB_HOST || 'mongodb://127.0.0.1:27017', {
  useUnifiedTopology: true,
});
await dbClient.connect();
const db = dbClient.db(process.env.DB_DATABASE || 'files_manager');

fileQueue.process(async (job, done) => {
  const { userId, fileId } = job.data;

  if (!userId || !fileId) {
    done(new Error('Missing fileId or userId'));
    return;
  }

  const file = await db.collection('files').findOne({
    _id: new ObjectId(fileId),
    userId: new ObjectId(userId),
  });

  if (!file) {
    done(new Error('File not found'));
    return;
  }

  if (file.type !== 'image') {
    done(new Error('File is not an image'));
    return;
  }

  const sizes = [500, 250, 100];
  const localPath = file.localPath;

  try {
    for (const size of sizes) {
      const thumbnail = await imageThumbnail(localPath, { width: size });
      const thumbPath = `${localPath}_${size}`;
      await fs.promises.writeFile(thumbPath, thumbnail);
    }
    done();
  } catch (error) {
    console.error(`Error generating thumbnails: ${error.message}`);
    done(error);
  }
});
