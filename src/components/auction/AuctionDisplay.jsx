"use client"
import { useState, useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { parseEther, formatEther } from "viem"
import { useQRBidContract } from "../../hooks/useQRBidContract"

export default function AuctionDisplay() {
    const { isConnected, address } = useAccount()
    const { currentUrl, timeRemaining, isAuctionActive, currentAuction, placeBid, isBidding } =
        useQRBidContract()

    const [bidUrl, setBidUrl] = useState("")
    const [bidAmount, setBidAmount] = useState("")
    const [timeLeft, setTimeLeft] = useState(0)

    // Initialize and update countdown
    useEffect(() => {
        if (timeRemaining) {
            setTimeLeft(Number(timeRemaining))
        }
    }, [timeRemaining])

    // Countdown timer - decrements every second
    useEffect(() => {
        if (timeLeft <= 0) return

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                const newTime = prevTime - 1
                return newTime <= 0 ? 0 : newTime
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft])

    // Format time remaining
    const formatTimeRemaining = (seconds) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handlePlaceBid = async () => {
        if (!bidUrl || !bidAmount) return

        try {
            await placeBid(bidUrl, parseEther(bidAmount))
            setBidUrl("")
            setBidAmount("")
        } catch (error) {
            console.error("Bid failed:", error)
        }
    }

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    // bid amount calculation 
    const minimumBid = currentAuction
        ? currentAuction.highestBid && currentAuction.highestBid > 0n
            ? formatEther(currentAuction.highestBid + parseEther("0.001"))
            : "0.01"
        : "0.01"

    return (
        <div className="auction-card">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Current Auction</h2>

                {/* Wallet Connection */}
                <div className="mb-4">
                    <ConnectButton />
                </div>

                {/* Auction Status */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Status:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isAuctionActive
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-red-500/20 text-red-300"
                            }`}
                        >
                            {isAuctionActive ? "Active" : "Ended"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Time Remaining:</span>
                        <span className="text-white font-mono text-lg">
                            {timeLeft > 0 ? formatTimeRemaining(timeLeft) : "00:00:00"}
                        </span>
                    </div>

                    {currentAuction && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Current Bid:</span>
                                <span className="text-white font-bold">
                                    {currentAuction.highestBid && currentAuction.highestBid > 0n
                                        ? `${formatEther(currentAuction.highestBid)} ETH`
                                        : "No bids yet"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Current Winner:</span>
                                <span className="text-white font-mono text-sm">
                                    {currentAuction.highestBidder &&
                                    currentAuction.highestBidder !==
                                        "0x0000000000000000000000000000000000000000"
                                        ? `${currentAuction.highestBidder.slice(0, 6)}...${currentAuction.highestBidder.slice(-4)}`
                                        : "No winner yet"}
                                </span>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-gray-300">Current URL:</span>
                                <div className="text-right max-w-xs">
                                    {currentUrl ? (
                                        <a
                                            href={currentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm break-all"
                                        >
                                            {currentUrl}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 text-sm">No URL set</span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bid Form */}
            {isConnected && isAuctionActive ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your URL
                        </label>
                        <input
                            type="url"
                            value={bidUrl}
                            onChange={(e) => setBidUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bid Amount (ETH)
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            min={minimumBid}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`Minimum: ${minimumBid} ETH`}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">Minimum bid: {minimumBid} ETH</p>
                    </div>

                    <button
                        onClick={handlePlaceBid}
                        disabled={isBidding || !isValidUrl(bidUrl) || !bidAmount}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isBidding ? "Placing Bid..." : "Place Bid"}
                    </button>
                </div>
            ) : !isConnected ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Connect your wallet to place bids</p>
                </div>
            ) : !isAuctionActive ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Auction has ended</p>
                    <p className="text-sm text-gray-500">Waiting for next auction to start...</p>
                </div>
            ) : null}
        </div>
    )
}
