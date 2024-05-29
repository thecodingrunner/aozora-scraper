"use server"

import { scrapeAozoraBookInfo } from "../infoScraper";
import { scrapeAozoraBook } from "../scraper"

export async function scrapeAndStoreBook(bookUrl) {
    if (!bookUrl) return 

    try {
        const scrapedBook = await scrapeAozoraBook(bookUrl)

        return scrapedBook;
    } catch (error) {
        throw new Error(`Failed to find book: ${error.message}`)
    }
}

export async function scrapeBookInfo(bookUrl) {
    if (!bookUrl) return 

    try {
        const scrapedBookInfo = await scrapeAozoraBookInfo(bookUrl)

        return scrapedBookInfo;
    } catch (error) {
        throw new Error(`Failed to find book info: ${error.message}`)
    }
}