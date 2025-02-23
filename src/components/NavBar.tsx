"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-8">
  <Link href="/map" className={`text-white hover:text-gray-300 ${pathname === '/map' ? 'border-b-2 border-white' : ''}`}>
    Map
  </Link>
  <Link href="/impact" className={`text-white hover:text-gray-300 ${pathname === '/impact' ? 'border-b-2 border-white' : ''}`}>
    Impact
  </Link>
  <Link href="/achievement" className={`text-white hover:text-gray-300 ${pathname === '/achievement' ? 'border-b-2 border-white' : ''}`}>
    Achievement
  </Link>
</nav>
  )
}