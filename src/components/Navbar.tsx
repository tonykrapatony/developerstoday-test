import Link from 'next/link'
import React from 'react'


const Navbar = () => {
  return (
    <header className='block h-12 w-full px-5 py-2.5 border-b bg-gray-700'>
      <Link href='/' className='text-2xl text-white font-bold'>Home</Link>
    </header>
  )
}

export default Navbar;