"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link href="/map" className={`text-gray-600 hover:text-gray-900 ${pathname === '/map' ? 'border-b-2 border-green-600' : ''}`}>
        Map
      </Link>
      <Link href="/impact" className={`text-gray-600 hover:text-gray-900 ${pathname === '/impact' ? 'border-b-2 border-green-600' : ''}`}>
        Impact
      </Link>
      <Link href="/achievement" className={`text-gray-600 hover:text-gray-900 ${pathname === '/achievement' ? 'border-b-2 border-green-600' : ''}`}>
        Achievement
      </Link>
    </nav>
  )
}