// src/components/CryptoTicker.jsx

"use client"

import { useState, useEffect } from "react"

export default function CryptoTicker({ initialData = [] }) {
    const [cryptoData, setCryptoData] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Function to fetch crypto data from our API
    const fetchCryptoData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch("/api/crypto")

            if (!response.ok) {
                throw new Error("Failed to fetch crypto data")
            }

            const data = await response.json()
            setCryptoData(data)
        } catch (err) {
            console.error("Error fetching crypto data:", err)
            setError("Failed to update crypto prices")
        } finally {
            setIsLoading(false)
        }
    }

    // Update crypto data every 60 seconds
    useEffect(() => {
        const interval = setInterval(fetchCryptoData, 60000) // 60 seconds
        return () => clearInterval(interval)
    }, [])

    // Format price with proper decimals
    const formatPrice = (price) => {
        if (price >= 1) {
            return price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        } else {
            return price.toFixed(6)
        }
    }

    // Format percentage change
    const formatChange = (change) => {
        const formatted = Math.abs(change).toFixed(2)
        return change >= 0 ? `+${formatted}%` : `-${formatted}%`
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700 text-sm">{error}</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 text-white py-3 overflow-hidden relative">
            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute top-1 right-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
            )}

            {/* Scrolling ticker */}
            <div className="relative">
                <div className="animate-scroll flex items-center space-x-8 whitespace-nowrap">
                    {/* Duplicate the data to create seamless loop */}
                    {[...cryptoData, ...cryptoData].map((crypto, index) => (
                        <div
                            key={`${crypto.id}-${index}`}
                            className="flex items-center space-x-2 min-w-max"
                        >
                            <span className="font-semibold text-sm">{crypto.symbol}</span>
                            <span className="text-sm">${formatPrice(crypto.price)}</span>
                            <span
                                className={`text-xs px-1 py-0.5 rounded ${
                                    crypto.change24h >= 0
                                        ? "bg-green-600 text-green-100"
                                        : "bg-red-600 text-red-100"
                                }`}
                            >
                                {formatChange(crypto.change24h)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Last updated info */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-400">Live • Updates every 60s</span>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}
