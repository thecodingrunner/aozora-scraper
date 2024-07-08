import React from 'react'

import { useRouter } from 'next/navigation'

const BookItem = ({book}) => {
    // console.log(book)
    const router = useRouter()

    const handleEdit = (book) => {
      router.push(`/?id=${book._id}`)
    }

    const handleDelete = async (book) => {
      const hasConfirmed = confirm("Are you sure you want to delete this book?")

      if (hasConfirmed) {
        try {
          await fetch(`/api/book/${book._id.toString()}`,{
            method: 'DELETE'
          })
          router.push(`/profile-page`)
        } catch (error) {
          console.log(error)
        }
      }
    }

  return (
    <div className='flex flex-col gap-2 dashboard-box mt-10'>
        <h3 className='text-xl'><b>Title:</b> {book.title}</h3>
        <h3 className='text-gray-700'><b>Author:</b> {book.author}</h3>
        <h3><b>Difficulty Score:</b> {book.score}%</h3>
        <h3><b>Words:</b> {book.words.slice(0,3).map(word => (
          <span>{word}, </span> 
        ))}...</h3>
        <button className='btn-black font-semibold mt-auto' onClick={() => handleEdit(book)}>View Book</button>
        <button className='btn-black font-semibold' onClick={() => handleDelete(book)}>Delete Book</button>
    </div>
  )
}

export default BookItem