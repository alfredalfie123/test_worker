const { parentPort } = require('worker_threads');
const puppeteer = require('puppeteer-extra');

(async function count() {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: false
    });

    const context = await browser.defaultBrowserContext();
    await context.newPage();
    parentPort.postMessage({
      count: 1
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
})();
