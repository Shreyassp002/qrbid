"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Zap } from "lucide-react"

export default function Header() {
    return (
        <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">QRBid</h1>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">
                            BETA
                        </span>
                    </div>

                    {/* <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-300 hover:text-white">
                            Auctions
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white">
                            How it Works
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white">
                            Stats
                        </a>
                    </nav> */}

                    <ConnectButton />
                </div>
            </div>
        </header>
    )
}