"use client";

import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

const pageLength = 1000

const BookReader = ({ book, savedWords, page, setPage }) => {
  const [black, setBlack] = useState(false);
  const [sepia, setSepia] = useState(false);
  const [white, setWhite] = useState(true);
  const [textSize, setTextSize] = useState(9);
  const [oldFont, setOldFont] = useState(false);
  const [hiragana, setHiragana] = useState(false);

  useEffect(() => {
    console.log(book)
    console.log(page)
  },[])

  // console.log(savedWords);

  useEffect(() => {
    console.log(textSize);
  }, [textSize]);

  function turnOnBlack() {
    setSepia(false);
    setBlack(true);
    setWhite(false);
  }

  function turnOnSepia() {
    setSepia(true);
    setBlack(false);
    setWhite(false);
  }

  function turnOnWhite() {
    setSepia(false);
    setBlack(false);
    setWhite(true);
  }

  function selectTextSize() {
    switch (true) {
      case textSize < 10:
        return "text-xl";
      case textSize > 10 && textSize < 20:
        return "text-2xl";
      case textSize > 20 && textSize < 30:
        return "text-3xl";
      case textSize > 30 && textSize < 40:
        return "text-4xl leading-relaxed";
      case textSize > 40 && textSize <= 50:
        return "text-5xl leading-relaxed";
    }
  }

  return (
    <div
      className={`${black ? "bg-black text-white" : ""} ${
        sepia ? "bg-[#FBF0D9] text-[#5F4B32]" : ""
      } ${white ? "bg-white" : ""} p-10`}
    >
      <article className="w-full sm:w-9/12 mx-auto">
        <h1
          className={`text-4xl text-center my-8 font-semibold ${
            oldFont ? "old-font" : "modern-font"
          }`}
        >
          {book.title}
        </h1>
        <h2
          className={`text-3xl text-center my-6 font-medium ${
            oldFont ? "old-font" : "modern-font"
          }`}
        >
          {book.author}
        </h2>
        <div
          className={`${selectTextSize()} leading-10 ${
            oldFont ? "old-font" : "modern-font"
          }`}
        >
          {hiragana
            ? book.text.slice(pageLength * (page - 1), pageLength * page)
            : book.textNoHiragana.slice(pageLength * (page - 1), pageLength * page)}
        </div>
        <div className="w-full flex justify-center items-center text-3xl gap-3 mt-10">
          {page < 3 ? (
            <>
              <button onClick={() => setPage(1)}>Start</button>
              <button onClick={() => setPage((prev) => prev - 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button onClick={() => setPage(1)} className={`${page === 1 ? 'font-bold' : ''}`}>1</button>
              <button onClick={() => setPage(2)} className={`${page === 2 ? 'font-bold' : ''}`}>2</button>
              <button onClick={() => setPage(3)} className={`${page === 3 ? 'font-bold' : ''}`}>3</button>
              <button onClick={() => setPage(4)} className={`${page === 4 ? 'font-bold' : ''}`}>4</button>
              <button onClick={() => setPage(5)} className={`${page === 5 ? 'font-bold' : ''}`}>5</button>
              <button onClick={() => setPage((prev) => prev + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
              <button onClick={() => setPage(hiragana ? Math.ceil(book.text.length/pageLength) : Math.ceil(book.textNoHiragana.length/pageLength))}>End</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage(1)}>Start</button>
              <button onClick={() => setPage((prev) => prev - 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button onClick={() => setPage(page-2)}>{page-2}</button>
              <button onClick={() => setPage(page-1)}>{page-1}</button>
              <button onClick={() => setPage(page)} className="font-bold">{page}</button>
              <button onClick={() => setPage(page+1)}>{page+1}</button>
              <button onClick={() => setPage(page+2)}>{page+2}</button>
              <button onClick={() => setPage((prev) => prev + 1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
              <button onClick={() => setPage(hiragana ? Math.ceil(book.text.length/pageLength) : Math.ceil(book.textNoHiragana.length/pageLength))}>End</button>
            </>
          )}
        </div>
      </article>

      <Draggable>
        <div className="hidden fixed top-1/2 left-2 bg-black opacity-90 p-5 sm:flex flex-col gap-3 rounded-lg border-2 border-white">
          <label className="p-2 flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="50"
              value={textSize}
              class="slider"
              id="myRange"
              onChange={(e) => {
                e.stopPropagation();
                setTextSize(e.target.value);
              }}
            />
          </label>
          <button
            className="btn-black rounded-lg border-2 border-white"
            onClick={turnOnWhite}
          >
            White
          </button>
          <button
            className="btn-black rounded-lg border-2 border-white"
            onClick={turnOnBlack}
          >
            Black
          </button>
          <button
            className="btn-black rounded-lg border-2 border-white"
            onClick={turnOnSepia}
          >
            Sepia
          </button>
          {/* <button
            className="btn-black rounded-lg border-2 border-white"
            onClick={() => setOldFont(prev => !prev)}
          >
            {oldFont ? 'Modern Font' : 'Classic Font'}
          </button> */}
          <button
            className="btn-black rounded-lg border-2 border-white"
            onClick={() => setHiragana((prev) => !prev)}
          >
            {hiragana ? "No Hiragana" : "Hiragana"}
          </button>
        </div>
      </Draggable>
      <Draggable>
        <div className="hidden sm:flex flex-col items-center gap-2 bg-black opacity-90 rounded-lg border-white border-2 max-h-[70vh] overflow-auto fixed right-2 top-1/2 p-3 min-w-40">
          {savedWords.map((word) => (
            <div key={word} className="text-white">
              {word}
            </div>
          ))}
        </div>
      </Draggable>
    </div>
  );
};

export default BookReader;
