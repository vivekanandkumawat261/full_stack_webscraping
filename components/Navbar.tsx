import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className="w-full">
        <nav className="nav">
            <Link href="/" className="flex gap-10">
            <div className="flex gap-10">
                <div>Item A</div>
                <div>Item B</div>
            </div>
            <div className="text-red-500">Tailwind test</div>
            <Image
              src="/assets/icons/logo.svg"
              width={27}
              height={27}
              alt="logo"
            />
            </Link>
        </nav>
    </header>
  )
}

export default Navbar
