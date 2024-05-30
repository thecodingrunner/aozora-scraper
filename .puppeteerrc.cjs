const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Changes the cache location for Puppeteer.
    cacheDirectory: join('C:', 'Users', 'Finn', 'repos', 'book-analysis-app', '.cache', 'puppeteer'),
    executablePath: join('C:', 'Users', 'Finn', 'repos', 'book-analysis-app', '.cache', 'puppeteer', 'chrome', 'win64-125.0.6422.78', 'chrome-win64', 'chrome.exe'),
};