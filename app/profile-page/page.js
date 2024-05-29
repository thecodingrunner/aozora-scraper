"use client"

import BookItem from '@/components/BookItem'
import Book from '@/models/book'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Library = (books) => {
    const [filter, setFilter] = useState('newFirst')
    const [bookData, setBookData] = useState(books.data)
    console.log(bookData)

    useEffect(() => {
        switch (filter) {
            case 'newFirst':
                setBookData(bookData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))
                break;
            case 'oldFirst':
                setBookData(bookData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
                break;
            case 'scoreHighLow':
                setBookData(bookData.sort((a, b) => a.score - b.score))
                break;
            case 'scoreLowHigh':
                setBookData(bookData.sort((a, b) => b.score - a.score))
                break;
            default:
                break;
        }
    },[filter])


    return (
        <>
            <h1 className='text-4xl font-semibold mt-10'>Your Collection</h1>
            <select id="filter" defaultValue={filter} onChange={(e) => setFilter(e.target.value)} className='p-2 border-2 mt-6'>
                <option value="newFirst">Newest First</option>
                <option value="oldFirst">Oldest First</option>
                <option value="scoreHighLow">Score Highest to Lowest</option>
                <option value="scoreLowHigh">Score Lowest to Highest</option>
            </select>
            <div className='grid grid-cols-3 gap-10'>
                {bookData.map((book) => (
                    <BookItem key={book._id} book={book} />
                ))}
            </div>
        </>
    )
}

const ProfilePage = () => {
    const { data: session } = useSession()

    const [books, setBooks] = useState(null)

    console.log(session)
    const router = useRouter()

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('/api/book');
            const data = await response.json();
            console.log(data)

            setBooks(data)
        }

        if (session) {
            fetchPosts()
        }
    },[session])

  return (
    <div className='w-9/12 mx-auto mt-10 mb-20'>
        {session ? (
        <>
            <div className='flex gap-5 items-center'>
                <Image src={session?.user.image} width={100} height={100} className='rounded-full' alt='profile' />
                <h1 className='font-bold text-4xl'>{session?.user.name}'s Profile</h1>
            </div>
            {books && <Library data={books} />}
        </>
        ) : 
        router.push('/')}
    </div>
  )
}

export default ProfilePage