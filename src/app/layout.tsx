import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import { Bell, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavBar from "@/components/NavBar"

export const metadata: Metadata = {
  title: "Madinati Route Finder Demo - Navigate with Buses, Trains, Tramways, Metros, and On Foot",
  description:
    "Find the best routes using buses, trains, tramways, metros, and on foot with our comprehensive route-finding app.",
  keywords: "route finder, navigation, buses, trains, tramways, metros, walking, public transport, path finding",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta
          name="description"
          content="Find the best routes using buses, trains, tramways, metros, and on foot with our comprehensive route-finding app."
        />
        <meta
          name="keywords"
          content="route finder, navigation, buses, trains, tramways, metros, walking, public transport, path finding"
        />
        <meta name="author" content="Your Name or Company" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <title>Route Finder - Navigate with Buses, Trains, Tramways, Metros, and On Foot</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400&family=Geist+Mono:wght@400&family=Twemoji:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Geist', 'Geist Mono', 'Noto', sans-serif" }}>
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
              <Link href="/" className="flex items-center gap-1">
                <span className="text-green-600 font-bold text-xl">Trans</span>
                <span className="font-medium text-xl">eco</span>
              </Link>
            </div>

            <NavBar />

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>
        <Toaster richColors={true} theme="dark" position="top-left" />
      </body>
    </html>
  )
}

