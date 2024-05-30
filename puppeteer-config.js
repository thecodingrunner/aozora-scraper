import { join } from 'path';
import chromium from '@sparticuz/chromium'

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

const puppeteerConfig = async () => ({
    cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
    executablePath: isServerless 
        ? join(__dirname, '.cache', 'puppeteer', 'chrome', 'win64-125.0.6422.78', 'chrome-win64', 'chrome.exe')
        : join('C:', 'Users', 'Finn', 'repos', 'book-analysis-app', '.cache', 'puppeteer', 'chrome', 'win64-125.0.6422.78', 'chrome-win64', 'chrome.exe'),
    args: isServerless ? chromium.args : [],
    defaultViewport: chromium.defaultViewport,
    headless: isServerless ? chromium.headless : true,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--disable-extensions'],
});

export default puppeteerConfig;
