"use client";

import React, { useState } from "react";
import DialogBox from "./DialogBox";
import grammarList from "@/data/grammar";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const StatsDashboard = ({
  includedVocab,
  includedGrammar,
  frequency,
  freqScore,
  numberOfKanji,
  numberOfSentences,
  averageSentenceLength,
  bookInfo,
  numberOfPages
}) => {
  const [isOpenN1Vocab, setIsOpenN1Vocab] = useState(false);
  const [isOpenN2Vocab, setIsOpenN2Vocab] = useState(false);
  const [isOpenN3Vocab, setIsOpenN3Vocab] = useState(false);
  const [isOpenN4Vocab, setIsOpenN4Vocab] = useState(false);
  const [isOpenN5Vocab, setIsOpenN5Vocab] = useState(false);

  const [isOpenN1Grammar, setIsOpenN1Grammar] = useState(false);
  const [isOpenN2Grammar, setIsOpenN2Grammar] = useState(false);
  const [isOpenN3Grammar, setIsOpenN3Grammar] = useState(false);
  const [isOpenN4Grammar, setIsOpenN4Grammar] = useState(false);
  const [isOpenN5Grammar, setIsOpenN5Grammar] = useState(false);

  const [openScoreInfo, setOpenScoreInfo] = useState(false);

  const vocab = includedVocab;
  const grammar = includedGrammar;


  return (
    <div className="flex flex-col justify-left w-9/12 mx-auto gap-5 mb-10">
      <div className="dashboard-box flex-wrap">
        <h2 className="p-2 text-xl font-semibold">JLPT Vocabulary:</h2>
        <div className="flex gap-2 p-2 justify-left flex-wrap">
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN1Vocab(true)}
          >
            N1 vocab ({vocab.n1.length}) (
            {Math.round((vocab.n1.length / 3474) * 100)}%)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN2Vocab(true)}
          >
            N2 vocab ({vocab.n2.length}) (
            {Math.round((vocab.n2.length / 1834) * 100)}%)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN3Vocab(true)}
          >
            N3 vocab ({vocab.n3.length}) (
            {Math.round((vocab.n3.length / 1835) * 100)}%)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN4Vocab(true)}
          >
            N4 vocab ({vocab.n4.length}) (
            {Math.round((vocab.n4.length / 634) * 100)}%)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN5Vocab(true)}
          >
            N5 vocab ({vocab.n5.length}) (
            {Math.round((vocab.n5.length / 668) * 100)}%)
          </button>
        </div>
      </div>

      <div className="dashboard-box">
        <h2 className="p-2 text-xl font-semibold">JLPT Grammar:</h2>
        <div className="flex gap-2 p-2 justify-left flex-wrap">
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN1Grammar(true)}
          >
            N1 grammar ({grammar.n1.length}) (
            {Math.round(
              (grammar.n1.length / grammarList.n1Grammar.length) * 100
            )}
            %)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN2Grammar(true)}
          >
            N2 grammar ({grammar.n2.length}) (
            {Math.round(
              (grammar.n2.length / grammarList.n2Grammar.length) * 100
            )}
            %)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN3Grammar(true)}
          >
            N3 grammar ({grammar.n3.length}) (
            {Math.round(
              (grammar.n3.length / grammarList.n3Grammar.length) * 100
            )}
            %)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN4Grammar(true)}
          >
            N4 grammar ({grammar.n4.length}) (
            {Math.round(
              (grammar.n4.length / grammarList.n4Grammar.length) * 100
            )}
            %)
          </button>
          <button
            className="btn-black text-sm"
            onClick={() => setIsOpenN5Grammar(true)}
          >
            N5 grammar ({grammar.n5.length}) (
            {Math.round(
              (grammar.n5.length / grammarList.n5Grammar.length) * 100
            )}
            %)
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-20 dashboard-box">
        <div className="flex flex-col gap-4 justify-center">
          <p className="text-xl font-semibold">Kanji Count: {numberOfKanji}</p>
          <p className="text-xl font-semibold">Page Count: {numberOfPages}</p>
          <p className="text-xl font-semibold">Sentence Count: {numberOfSentences}</p>
          <p className="text-xl font-semibold">Average sentence length: {averageSentenceLength}</p>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl text-center my-4 font-semibold flex gap-2 items-center">
            Difficulty Rating 
            <button onClick={() => setOpenScoreInfo(true)} className="items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </button>
          </h2>
          <div className="progress-bar" style={{ "--percentage": `${freqScore * 3.6}deg`, "--color": `${freqScore < 33 ? 'green' : ''} ${freqScore < 66 && freqScore > 33 ? 'orange' : ''} ${freqScore > 66 ? 'red' : ''}` }}>
            <div
              className="progress z-10"
            ></div>
            <div className="score-text z-20">{freqScore}%</div>
          </div>
        </div>
      </div>

      {isOpenN1Vocab && <DialogBox
        contents={vocab.n1}
        isOpen={isOpenN1Vocab}
        setIsOpen={setIsOpenN1Vocab}
        vocab={true}
      />}
      {isOpenN2Vocab && <DialogBox
        contents={vocab.n2}
        isOpen={isOpenN2Vocab}
        setIsOpen={setIsOpenN2Vocab}
        vocab={true}
      />}
      {isOpenN3Vocab && <DialogBox
        contents={vocab.n3}
        isOpen={isOpenN3Vocab}
        setIsOpen={setIsOpenN3Vocab}
        vocab={true}
      />}
      {isOpenN4Vocab && <DialogBox
        contents={vocab.n4}
        isOpen={isOpenN4Vocab}
        setIsOpen={setIsOpenN4Vocab}
        vocab={true}
      />}
      {isOpenN5Vocab && <DialogBox
        contents={vocab.n5}
        isOpen={isOpenN5Vocab}
        setIsOpen={setIsOpenN5Vocab}
        vocab={true}
      />}

      {isOpenN1Grammar && <DialogBox
        contents={grammar.n1}
        isOpen={isOpenN1Grammar}
        setIsOpen={setIsOpenN1Grammar}
        vocab={false}
      />}
      {isOpenN2Grammar && <DialogBox
        contents={grammar.n2}
        isOpen={isOpenN2Grammar}
        setIsOpen={setIsOpenN2Grammar}
        vocab={false}
      />}
      {isOpenN3Grammar && <DialogBox
        contents={grammar.n3}
        isOpen={isOpenN3Grammar}
        setIsOpen={setIsOpenN3Grammar}
        vocab={false}
      />}
      {isOpenN4Grammar && <DialogBox
        contents={grammar.n4}
        isOpen={isOpenN4Grammar}
        setIsOpen={setIsOpenN4Grammar}
        vocab={false}
      />}
      {isOpenN5Grammar && <DialogBox
        contents={grammar.n5}
        isOpen={isOpenN5Grammar}
        setIsOpen={setIsOpenN5Grammar}
        vocab={false}
      />}

      {openScoreInfo && (
      <Dialog open={openScoreInfo} onClose={() => setOpenScoreInfo(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg dashboard-box bg-black text-white opacity-85">
            <DialogTitle className="font-bold mb-4 text-xl">What is the Frequency Score?</DialogTitle>
            <Description className="text-lg text-gray-200">Frequency score is the representation of how difficult a given text is to read, calculated using the frequency data of Aozora Bunko and <a href="https://simple.wikipedia.org/wiki/Zipf%27s_law#:~:text=Zipf's%20law%20is%20an%20empirical,rank%20in%20the%20frequency%20table." target="_blank"><u>Zipf's rule</u></a>. For example a score of 50% would be the average difficulty of an Aozora Bunko text.</Description>
            <div className="flex gap-4 mt-4 p-2 rounded-lg bg-gray-600 font-semibold text-lg">
              <button onClick={() => setOpenScoreInfo(false)}>Close</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>)}
    </div>
  );
};

export default StatsDashboard;
