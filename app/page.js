"use client";

import BookReader from "@/components/BookReader";
import StatsDashboard from "@/components/StatsDashboard";
import { scrapeAndStoreBook, scrapeBookInfo } from "@/lib/actions";
import { scrapeAozoraBook } from "@/lib/scraper";
import {
  checkCharacters,
  checkGrammar,
  checkFrequency,
  checkVocab,
  navigateAozora,
  addBookToDatabase,
} from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import React from "react";
import { handleNavigateSubmit } from "@/lib/utils";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { connectToDB } from "@/utils/database";
import Book from "@/models/book";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');

  const [searchNavigatePrompt, setSearchNavigatePrompt] = useState("");
  const [includedVocab, setIncludedVocab] = useState(null);
  const [includedGrammar, setIncludedGrammar] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [loaded, setLoaded] = useState('default');
  const [book, setBook] = useState("");
  const [bookInfo, setBookInfo] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [openAuthorInfo, setOpenAuthorInfo] = useState(false);
  const [submitted, setSubmitted] = useState(false)

  // Section for selecting words and adding to collection
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptPosition, setPromptPosition] = useState({ x: 0, y: 0 })
  const [savedWords, setSavedWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState('')

  const saveWord = (word) => {
    if (word && !savedWords.includes(word)) {
      const newWords = [...savedWords, word];
      setSavedWords(newWords);
      setSelectedWord('');
      setShowPrompt(false);
    }
  };

  const handleTextSelection = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      setSelectedWord(selectedText);
      const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      setPromptPosition({ x: rect.right, y: rect.bottom });
      setShowPrompt(true);
    } else {
      setShowPrompt(false)
    }
  };

  useEffect(() => {
    console.log(savedWords)
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [savedWords]);

  useEffect(() => {
    const getBookDetails = async () => {
      const response = await fetch(`/api/book/${bookId}`)
      const data = await response.json();

      console.log(data.words)
      setSearchNavigatePrompt(data.link)

      submitFunction(data.link)
      setSavedWords(data.words)
    }

    if (bookId) {
      getBookDetails()
      setSubmitted(true)
    }
  },[])

  const handleNavigateSubmit = async (event) => {
    event.preventDefault();

    setSavedWords([])
    submitFunction(searchNavigatePrompt)
  };

  const submitFunction = async (searchNavigatePrompt) => {
    setLoaded(false);
    setSubmitted(false);

    console.log('submitted')

    try {
      // Scrape book info
      const info = await scrapeBookInfo(searchNavigatePrompt);
      setBookInfo(info);
      // Navigate to book and scrape book
      const link = await navigateAozora(searchNavigatePrompt);
      const bookTemp = await scrapeAndStoreBook(link);
      setBook(bookTemp);

      console.log(book)

      // Analyse for vocab and grammar and set to states
      const listOfVocab = await checkVocab(bookTemp.textNoHiragana);
      const listOfGrammar = await checkGrammar(bookTemp.textNoHiragana);
      const frequency = await checkFrequency(bookTemp.textNoHiragana);
      console.log(frequency);
      setIncludedVocab(listOfVocab);
      setIncludedGrammar(listOfGrammar);
      setFrequency(frequency);

      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  const addBook = async () => {

    const bookToAdd = {
      userId: session?.user.id,
      title: `${bookInfo.bookInfo.titleKanji} (${bookInfo.bookInfo.titleHiragana})`,
      author: `${bookInfo.bookInfo.authorKanji} (${bookInfo.bookInfo.authorHiragana})`,
      link: searchNavigatePrompt,
      score: frequency.freqScore,
      savedWords,
    }

    try {
      
      const response = await fetch('/api/book/add', {
          method: 'POST',
          body: JSON.stringify(bookToAdd)
      })

      if (response.ok) {
          router.push('/');
          console.log('book added')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitted(true)
    }
  }

  const updateBook = async () => {
    console.log(bookId)

    // const words = savedWords;

    try {
      
      const response = await fetch(`/api/book/${bookId}`, {
          method: 'PATCH',
          body: JSON.stringify(savedWords)
      })

      if (response.ok) {
          router.push('/');
          console.log('book updated')

      }
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitted(true)
    }
  }

  return (
    <>
    {session?.user ? (
      <main className="flex flex-col justify-center gap-5 flex-grow">

        <form onSubmit={handleNavigateSubmit} className="mx-auto mt-10 flex">
          <input
            type="text"
            value={searchNavigatePrompt}
            onChange={(e) => setSearchNavigatePrompt(e.target.value)}
            className="border-2 w-96 py-2 text-2xl px-4"
            placeholder={"Enter a book url here..."}
          />
          <button className="py-2 px-4 bg-black text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>

        {bookInfo && (
          <div className="w-9/12 mx-auto">
            <h2 className="text-5xl font-bold my-6 flex gap-4 flex-wrap items-center">
              {bookInfo.bookInfo.titleKanji} ({bookInfo.bookInfo.titleHiragana}) 
              {(!submitted && !bookId) && (
                <button className="btn-black flex gap-2 items-center text-xl font-semibold" onClick={() => addBook()}>
                  Add Book
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              )}
              {(submitted && !bookId) && (
                <button className="btn-black flex gap-2 items-center text-xl font-semibold">
                  Book added
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              )}
              {bookId && (
              <button className="btn-black flex gap-2 items-center text-xl font-semibold" onClick={() => updateBook()}>
                Update Book
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              )}
            </h2>
            <button onClick={() => setOpenAuthorInfo(true)}>
              <h2 className="text-2xl text-gray-500 my-3">
                <span>Author: </span>
                <u>
                  {bookInfo.bookInfo.authorKanji} ({bookInfo.bookInfo.authorHiragana})
                </u>
              </h2>
            </button>
            <h2 className="text-2xl my-3">Publish Date: {bookInfo.bookInfo.publishYear}</h2>
          </div>
        )}

        <div className="flex gap-2 p-2 justify-center w-9/12 mx-auto">
          {loaded === true && (
            <button
              className="btn-black text-xl flex items-center gap-2 font-semibold"
              onClick={() => setShowStats((prev) => !prev)}
            >
              {showStats ? "Hide Stats" : "View Stats"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </button>
          )}
          {loaded === true && (
            <button
              disabled={!loaded}
              className="btn-black text-xl flex items-center gap-2 font-semibold"
              onClick={() => setShowBook((prev) => !prev)}
            >
              {showBook ? "Hide Book" : "Read Book"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </button>
          )}
          {!loaded && (
            <h1 className="text-center text-3xl">Loading Book Content...</h1>
          )}
        </div>

        {bookInfo && <Dialog open={openAuthorInfo} onClose={() => setOpenAuthorInfo(false)} className="relative z-50">
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg dashboard-box bg-black text-white opacity-85">
              <DialogTitle className="font-bold mb-4 text-xl"><b>Author:</b> {bookInfo.bookInfo.authorKanji} ({bookInfo.bookInfo.authorHiragana})</DialogTitle>
              <Description className="text-lg text-gray-200"><b>Biography:</b> {bookInfo.bookInfo.authorBio}</Description>
              <div className="flex gap-4 mt-4 p-2 rounded-lg bg-gray-600 font-semibold text-lg">
                <button onClick={() => setOpenAuthorInfo(false)}>Close</button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>}

        <div>
          {showStats &&
            includedGrammar &&
            includedVocab &&
            frequency && (
              <StatsDashboard
                includedVocab={includedVocab}
                includedGrammar={includedGrammar}
                frequency={frequency.includedItems}
                freqScore={frequency.freqScore}
                numberOfSentences={frequency.numberOfSentences}
                numberOfWords={frequency.numberOfWords}
                averageSentenceLength={frequency.averageSentenceLength}
                bookInfo={bookInfo.bookInfo}
              />
            )}
          {showBook && book && <BookReader book={book} savedWords={savedWords} />}
          {/* includedVocab !== "" && includedGrammar !== "" */}
        </div>

        {/* Prompt for saving word */}
        {showPrompt && (
        <div
          style={{
            position: 'absolute',
            top: `${promptPosition.y + window.scrollY}px`,
            left: `${promptPosition.x + window.scrollX}px`,
          }}
          className={`bg-black opacity-90 text-white border-2 border-white rounded-lg p-2`}
        >
          <p>Save the word "{selectedWord}"?</p>
          <div className="flex justify-around mt-2">
            <button onClick={() => saveWord(selectedWord)} className="mr-2">Yes</button>
            <button onClick={() => setShowPrompt(false)} className="">No</button>
          </div>
        </div>
      )}
      </main>
    ) : (
      <main className="flex flex-col gap-5 w-9/12 mx-auto h-[70vh] justify-center">
        <h1 className="text-4xl">Welcome to Aozora Scraper</h1>
        <p className="text-2xl">Aozora Scraper analyses the difficulty of Aozora Bunko books, and presents the book in a more readable Kindle style format.</p>
        <p className="text-2xl">Please login to use the website.</p>
        <p className="text-2xl">Once you have logged in, you can paste the link of any desired Aozora Bunko book into the search bar, and the tool will analyse the text, providing data on the JLPT vocabulary and grammar used, general statistics, and the overall difficulty score.</p>
      </main>
    )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
