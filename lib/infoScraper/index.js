import axios from "axios";
import * as cheerio from "cheerio";
// import {encode, decode, labels} from 'iso-8859-2';
// // or…
// import * as iso88592 from 'iso-8859-2';
import iconv from "iconv-lite"
import { checkCharacters } from "../actions";

export async function scrapeAozoraBookInfo(url) {
    if (!url) return

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_cfe1cdec-zone-pricewise:rg61m81r2rf7 -k "http://lumtest.com/myip.json"
    
    // Brightdata proxy configuration
    const username = process.env.BRIGHT_DATA_USERNAME;
    const password = process.env.BRIGHT_DATA_PASSWORD;
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }
 
    try {
        const response = await axios.request({ method:'GET', responseType: 'arraybuffer', responseEncoding: 'binary', url: url }, options);

        // const decoder = new TextDecoder('ISO-8859-1');
        // let data = decoder.decode(response.data)

        const decodedData = iconv.decode(Buffer.from(response.data), 'utf-8');

        // Shift_JIS
        const $ = cheerio.load(decodedData);

        // book info
        const titleKanji = $('table:first').find('tr:first').children('td').eq(1).children('font').text().trim();
        const titleHiragana = $('table:first').find('tr').eq(1).children('td').eq(1).text().trim();
        const publishYear = $('table').eq(3).find('tr').eq(2).children('td').eq(1).text().trim();

        // author info
        const authorKanji = $('table').eq(2).find('tr').eq(1).children('td').eq(1).children('a').text().trim();
        const authorHiragana = $('table').eq(2).find('tr').eq(2).children('td').eq(1).text().trim();
        const authorBio = $('table').eq(2).find('tr').eq(6).children('td').eq(1).text().trim();


        const bookInfo = {titleKanji, titleHiragana, authorKanji, authorHiragana, publishYear, authorBio}
        // console.log(bookInfo)

        return {bookInfo}
    } catch (error) {
        throw new Error(`Failed to scrape book: ${error.message}`)
    }


}