"use client"

import Link from 'next/link'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Image from 'next/image'

const Navbar = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState(null);
  const [menu, setMenu] = useState(false)

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
      <Link href="/" className='text-4xl sm:text-5xl font-bold'>Aozora Scraper</Link>
      {session?.user ? (
        <>
          <div className='hidden gap-4 items-center md:flex'>
            <Link href="/profile-page" className='text-lg font-semibold'>Profile Page</Link>
            <button type='button' onClick={() => signOut()} className='btn-black font-semibold text-lg'>Logout</button>
            {session?.user.image && (
              <Image src={session?.user.image} width={50} height={50} className='rounded-full' alt='profile' />
            )}
          </div>
          <button className='flex justify-center items-center md:hidden' onClick={() => setMenu(prev => !prev)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" className="size-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className={`${menu ? 'flex flex-col gap-3' : 'hidden'} absolute top-32 right-4 p-2 bg-white shadow-2xl rounded-lg`}>
            <Link href="/profile-page" className='text-lg font-semibold'>Profile Page</Link>
            <button type='button' onClick={() => signOut()} className='btn-black font-semibold text-lg'>Logout</button>
            {session?.user.image && (
              <Image src={session?.user.image} width={50} height={50} className='rounded-full' alt='profile' />
            )}
          </div>
        </>
      ) : (
        <>
          {/* {providers && (Object.values(providers).filter(provider => provider.id === 'google').map((provider) => (
            <button type='button' key={provider.name} onClick={() => signIn(provider.id)} className='btn-black font-semibold'>
              Sign In
            </button>
          )))} */}
        </>
      )}
    </nav>
  )
}

export default Navbar