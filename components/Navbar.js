"use client"

import Link from 'next/link'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Image from 'next/image'

const Navbar = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState(null);

  console.log(providers)

  useEffect(() => {
    const setProvider = async () => {
      const response = await getProviders()

      setProviders(response)
    }

    setProvider()
  },[])

  return (
    <nav className='flex justify-between px-10 items-center py-10 top-shadow'>
      <Link href="/" className='text-5xl font-bold'>Aozora Scraper</Link>
      {session?.user ? (
        <div className='flex gap-4 items-center'>
          <Link href="/profile-page" className='text-lg font-semibold'>Profile Page</Link>
          <button type='button' onClick={() => signOut()} className='btn-black font-semibold text-lg'>Logout</button>
          <Image src={session?.user.image} width={50} height={50} className='rounded-full' alt='profile' />
        </div>
      ) : (
        <>
          {providers && (Object.values(providers).map((provider) => (
            <button type='button' key={provider.name} onClick={() => signIn(provider.id)} className='btn-black font-semibold'>
              Sign In
            </button>
          )))}
        </>
      )}
    </nav>
  )
}

export default Navbar