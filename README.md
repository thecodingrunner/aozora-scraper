<h1>Aozora Scraper</h1>

<h2>Description</h2>
Next JS application that scrapes an online library resource using puppeteer, analyses the text, and presents it in a readable kindle style.

<h2>Project Purpose and Goal</h2>
The goal of this project was to create a tool for Japanese language learners that bridges the gap between their current skill level, and an extremely valuable yet difficult to use resource. Aozora Bunko is an online resource of roughly 20,000 Japanese texts/books, but can be difficult to navigate not enjoyable to read on. By simply pasting a book url into Aozora Scraper, the tool then scrapes the website, analyses the text, and provides the text in a much more readable format.

<h2>Webstack and Explanation</h2>
NextJS, React, MongoDB, Puppeteer, TailwindCSS, Cheerio, Next Auth
This project was coded using NextJS, with Puppeteer and Cheerio used for web scraping. Some challenging aspects of creating this website included: correctly scraping the information from poorly structured html, fetching a large word frequency JSON file and using the data to calculate difficulty scores, integrating Next Auth, integrating a Mongo DB for adding books, integrating CRUD operations for adding and editing books.
