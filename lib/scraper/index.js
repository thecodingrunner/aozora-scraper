import axios from "axios";
import * as cheerio from "cheerio";
// import {encode, decode, labels} from 'iso-8859-2';
// // or…
// import * as iso88592 from 'iso-8859-2';
import iconv from "iconv-lite"
import { checkCharacters } from "../actions";

export async function scrapeAozoraBook(url) {
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

        const decodedData = iconv.decode(Buffer.from(response.data), 'Shift_JIS');

        // 

        const $ = cheerio.load(decodedData);

        const text = $('.main_text').text().trim();
        const title = $('.title').text().trim()
        const author = $('.author').text().trim()

        // Iterate over each ruby element and remove its rt and rp children
        $('.main_text').each(function() {
            $(this).find('rt, rp').remove();
        });

        // Extract the text content
        const textNoHiragana = $('.main_text').text().trim();

        // console.log(textNoHiragana)

        const japanesePunctuation = /[\u3000-\u303F\uFF00-\uFFEF]/g;
        const hiraganaKatakanaRegex = /[\u3040-\u309F\u30A0-\u30FF]/g;
  
        // Replace all matched characters with an empty string
        // const textPure = textNoHiragana.replace(japanesePunctuation, '').replace(' ','').replace('　', '').replace('―','').replace('・','').replace('…','');
        const textPure = textNoHiragana.normalize('NFKC')
            .replace(japanesePunctuation, '')
            .replace(/\s+/g, '')  // Replaces all types of spaces
            .replace(/[?123456789().―・…]/g, '')
            .replace(hiraganaKatakanaRegex , '');
        // console.log(textPure)

        // const averageWordLength = (array) => {
        //     if (array.length === 0) return 0; // Handle empty array case
          
        //     // Calculate the total length of all strings
        //     const totalLength = array.reduce((acc, str) => acc + str.length, 0);
          
        //     // Calculate the average length
        //     const averageLength = totalLength / array.length;
          
        //     return averageLength;
        // };

        const numberOfSentences = Math.round(textNoHiragana.split('。').length)
        const averageSentenceLength = Math.round(textNoHiragana.length/numberOfSentences)
        const numberOfPages = Math.floor(textNoHiragana.length/400) + 1

        return {text, textNoHiragana, title, author, textPure, numberOfSentences, averageSentenceLength, numberOfPages}
    } catch (error) {
        throw new Error(`Failed to scrape book: ${error.message}`)
    }


}