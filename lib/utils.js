"use server"

import grammarList from "@/data/grammar";
import puppeteer from "puppeteer-core";
import * as nodeFetch from "node-fetch";
import fs from 'fs';
import path from 'path';
// import chrome from 'chrome-aws-lambda';
import chromium from '@sparticuz/chromium'

import puppeteerConfig from '../puppeteer-config.js';

export async function checkGrammar(text) {

    function findGrammarStructures(paragraph, grammarList) {
        let grammarStructures = []
        for (let item of grammarList) {
            if (paragraph.includes(item)) {
                grammarStructures.push(item)
            }
        }
        return grammarStructures
    }

    const n1 = findGrammarStructures(text, grammarList.n1Grammar)
    const n2 = findGrammarStructures(text, grammarList.n2Grammar)
    const n3 = findGrammarStructures(text, grammarList.n3Grammar)
    const n4 = findGrammarStructures(text, grammarList.n4Grammar)
    const n5 = findGrammarStructures(text, grammarList.n5Grammar)

    return {
        n1,
        n2,
        n3,
        n4,
        n5
    }

    // trialText = '';
    // const japaneseTextRegex = /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Punctuation}\p{Space_Separator}]/gu;
    // const cleanText = trialText.replace(regex, '');
}

export async function checkVocab(text) {

    const filePath = path.join(process.cwd(), 'public', 'vocabList.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    function findVocab(paragraph, vocabList) {
        let vocab = []
        for (let item of vocabList) {
            if (paragraph.includes(item[0])) {
                vocab.push(item)
            }
        }
        return vocab
    }

    const n1 = findVocab(text, data.n1)
    const n2 = findVocab(text, data.n2)
    const n3 = findVocab(text, data.n3)
    const n4 = findVocab(text, data.n4)
    const n5 = findVocab(text, data.n5)

    // const n1VocabLength = data.n1.length
    // const n2VocabLength = data.n2.length
    // const n3VocabLength = data.n3.length
    // const n4VocabLength = data.n4.length
    // const n5VocabLength = data.n5.length

    return {
        n1,
        n2,
        n3,
        n4,
        n5,
        // n1VocabLength,
        // n2VocabLength,
        // n3VocabLength,
        // n4VocabLength,
        // n5VocabLength
    }

    // trialText = '';
    // const japaneseTextRegex = /[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Punctuation}\p{Space_Separator}]/gu;
    // const cleanText = trialText.replace(regex, '');
}

export async function checkFrequency(text) {

    const filePath = path.join(process.cwd(), 'public', 'term_meta_bank_1.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    let includedItems = {};
    let freqScore = 0;
    let numberOfWords = 0;
    let numberOfSentences = 0;
    let averageSentenceLength = 0;

    function findIncludedWords(paragraph, frequencyList) {

        frequencyList.forEach(word => {
          let count = 0;
          let pos = paragraph.indexOf(word[0]);
      
          while (pos !== -1) {
            count++;
            pos = paragraph.indexOf(word[0], pos + 1);
          }
      
          includedItems[word[0]] = [count, word[2].value];
        });

        let frequencyScore = 0
        for (let word in includedItems) {
            frequencyScore += includedItems[word][0] * includedItems[word][1]
        }

        const averageWordLength = (array) => {
            if (array.length === 0) return 0; // Handle empty array case
          
            // Calculate the total length of all strings
            const totalLength = array.reduce((acc, str) => acc + str.length, 0);
          
            // Calculate the average length
            const averageLength = totalLength / array.length;
          
            return averageLength;
        };

        numberOfWords = Math.round(paragraph.length / averageWordLength(frequencyList))

        numberOfSentences = Math.round(paragraph.split('。').length)
        averageSentenceLength = Math.round(paragraph.length/numberOfSentences)


        console.log(averageWordLength(frequencyList))

        let calcVal = 0;
        let comparisonScore = 0;
        frequencyList.forEach(word => {
            calcVal += 1/word[2].value
        })
        console.log(calcVal)
        console.log(numberOfWords)
        frequencyList.forEach(word => {
            comparisonScore += numberOfWords * ((1/word[2].value)/calcVal) * (word[2].value)
        })
        // console.log(frequencyList.length)
        // comparisonScore = frequencyList.length * numberOfWords * (1/calcVal)

        freqScore = Math.round((frequencyScore / (comparisonScore))*100)
        console.log(comparisonScore, freqScore, frequencyScore, averageSentenceLength, numberOfSentences, numberOfWords)
    }

    findIncludedWords(text, data)

    return {includedItems, freqScore, numberOfWords, numberOfSentences, averageSentenceLength }
}

export async function navigateAozora(searchNavigatePrompt) {

    chromium.setGraphicsMode = false
    // const browser = await puppeteer.launch({
    // cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
    // args: chromium.args,
    // defaultViewport: chromium.defaultViewport,
    // executablePath: await chromium.executablePath,
    // headless: chromium.headless,
    // })

    const config = await puppeteerConfig();
    const browser = await puppeteer.launch(config);
 // Set to true if you want to run in headless mode
    const page = await browser.newPage();
  
    // Function to delay actions
    const delay = (time) => new Promise(resolve => setTimeout(resolve, time));
  
    try {
      // Step 1: Go to the first page
      await page.goto(searchNavigatePrompt);
      console.log(`Navigated to ${searchNavigatePrompt}`);
      await delay(500); // Wait for 0.5 seconds

      // Define the starting string for the link
      const linkStartsWith='./files/';

      // Wait for the page to load and for the links to be available
      await page.waitForSelector('a');

      // Find the link that starts with the specified string
      const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.getAttribute('href')));
      
      const targetLink = links.filter(link => link !== null).find(str => str.includes(linkStartsWith))

      // Step 2: Click on a link to the second page
      await page.click(`a[href="${targetLink}"]`);

      console.log(`Navigated to ${targetLink}`);

      const currentURL = page.url();
      await delay(500); // Wait for 0.5 seconds
      await browser.close()
      
      return currentURL
  
    } catch (error) {
      console.error('Error during navigation:', error);
    } finally {
      await browser.close();
    }
};
