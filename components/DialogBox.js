"use client"

import React, { useState } from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

const DialogBox = ({contents, isOpen, setIsOpen, vocab}) => {
    const [showTranslation, setShowTranslation] = useState(false)
    console.log(contents)

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed top-[10vh] left-1/8 z-50">
        <DialogPanel className="border-2 p-14 pt-0 pr-0 w-3/4 mx-auto h-[80vh] rounded-2xl bg-black opacity-90">
            <div className='flex justify-end items-center'>
                <button onClick={() => setIsOpen(false)} className='items-center py-6 px-6'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-10 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className='overflow-auto no-scrollbar max-h-[60vh]'>
                <div className={`flex flex-wrap gap-2 pr-20 max-h-[60vh]`}>
                    {vocab && (
                        <>
                            {contents.map((item) => (
                                <button onClick={(e) => {
                                    console.log(e.target.innerText)
                                    if (e.target.innerText === item[0]) {
                                        setShowTranslation(item[1])
                                    } else if (e.target.innerText === item[1]) {
                                        setShowTranslation(item[0])
                                    }
                                }}>
                                    <div className='p-2 border-2 rounded-lg text-white text-lg'>{showTranslation === item[1] ? item[1] : item[0]}</div>
                                </button>
                            ))}
                        </>
                    )}
                    {!vocab && (
                        <>
                            {contents.map((item) => (
                                <div className='p-2 border-2 rounded-lg text-white text-lg'>{item}</div>
                            ))}
                        </>
                    )}

                </div>
            </div>
        </DialogPanel>
    </Dialog>
  )
}

export default DialogBox