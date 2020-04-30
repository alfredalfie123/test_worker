const path = require('path');

// console.log(path.resolve(__dirname));
// console.log(process.cwd());
// console.log('PATH================');

// const puppeteerPath = path.resolve(
//   process.resourcesPath,
//   'app.asar.unpacked/node_modules/puppeteer/index.js'
// );

// console.log('puppeteerPath', puppeteerPath);

// eslint-disable-next-line import/no-dynamic-require
// const puppeteer = require(`${puppeteerPath}`);
const puppeteer = require('puppeteer');

async function openBrowser() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: false
  });

  const context = await browser.defaultBrowserContext();
  await context.newPage();
}

module.exports = openBrowser;
