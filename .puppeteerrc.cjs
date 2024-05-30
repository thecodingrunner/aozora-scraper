const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Changes the cache location for Puppeteer.
    cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
    executablePath: join(__dirname, '.cache', 'puppeteer', 'chrome', 'win63.125.0.6422.78', 'chrome-win64'),
};