const { parentPort } = require('worker_threads');
const openBrowser = require('./startPuppeteer');

(async () => {
  try {
    await openBrowser();
  } catch (err) {
    console.log('Error');
    console.log(err);
  } finally {
    parentPort.postMessage({ count: 1 });
  }
})();
