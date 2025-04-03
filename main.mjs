// main.mjs
import dbClient from './utils/db.mjs';

const waitConnection = () => {
  return new Promise((resolve, reject) => {
    let i = 0;
    const repeatFct = async () => {
      setTimeout(() => {
        i += 1;
        if (i >= 10) {
          reject();
        } else if (!dbClient.isAlive()) {
          repeatFct();
        } else {
          resolve();
        }
      }, 1000);
    };
    repeatFct();
  });
};

(async () => {
  console.log(dbClient.isAlive()); // false (au début)
  await waitConnection();          // attend que MongoDB soit prêt
  console.log(dbClient.isAlive()); // true
  console.log(await dbClient.nbUsers());
  console.log(await dbClient.nbFiles());
})();
