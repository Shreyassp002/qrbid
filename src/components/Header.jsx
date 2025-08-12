"use client"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Zap } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header({ currentPage = "home" }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50
            setScrolled(isScrolled)
        }

        // Check initial scroll position
        handleScroll()

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Determine background based on page and scroll
    const getHeaderBackground = () => {
        // On home page, show background only when scrolled
        return scrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ease-out ${getHeaderBackground()}`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-xl font-bold">QRBid</span>
                </div>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/"
                        className={`transition-colors font-medium ${
                            currentPage === "home"
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/auction"
                        className={`transition-colors font-medium ${
                            currentPage === "auction"
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        Auction
                    </Link>
                </nav>

                {/* Right side buttons */}
                <div className="flex items-center space-x-4">
                    <ConnectButton />
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button className="text-gray-300 hover:text-white p-2">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}
