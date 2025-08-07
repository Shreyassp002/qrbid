"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
    return (
        <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-white">QRBid</h1>
                        <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            BETA
                        </span>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-300 hover:text-white">
                            Auctions
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white">
                            How it Works
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white">
                            Stats
                        </a>
                    </nav>

                    <ConnectButton />
                </div>
            </div>
        </header>
    )
}
