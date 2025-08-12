"use client"
import { useState, useEffect } from "react"
import { parseEther, formatEther } from "viem"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useQRBidContract } from "@/hooks/useQRBidContract"

export default function AuctionDisplay() {
    const { isConnected, address } = useAccount()
    const {
        currentAuctionUrl,
        timeRemaining,
        isAuctionActive,
        currentAuction,
        lastCompletedAuction,
        placeBid,
        isBidding,
        refetchAll,
    } = useQRBidContract()

    const [bidUrl, setBidUrl] = useState("")
    const [bidAmount, setBidAmount] = useState("")
    const [timeLeft, setTimeLeft] = useState(0)

    // update countdown for auction
    useEffect(() => {
        if (timeRemaining) {
            setTimeLeft(Number(timeRemaining))
        }
    }, [timeRemaining])

    // Countdown timer for auction
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
            // Refetch data after successful bid
            setTimeout(refetchAll, 2000)
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
        <div className="qr-card">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-4">Current Auction</h2>

                {/* Auction Status */}
                <div className="space-y-3 mb-4">
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

                    {/* Auction ID */}
                    {currentAuction && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Auction #:</span>
                            <span className="text-white font-mono">
                                {currentAuction.auctionId
                                    ? currentAuction.auctionId.toString()
                                    : "N/A"}
                            </span>
                        </div>
                    )}

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
                        </>
                    )}
                </div>

                {/* Current Auction URL - Only show during active auction with bids */}
                {isAuctionActive && currentAuctionUrl && currentAuctionUrl.trim() !== "" && (
                    <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-green-300">Current Auction URL:</p>
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                                Leading Bidder
                            </span>
                        </div>

                        <a
                            href={currentAuctionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm break-all block"
                        >
                            {currentAuctionUrl}
                        </a>

                        <p className="text-xs text-green-400 mt-1">
                            This URL will be displayed on QR code if this bid wins
                        </p>
                    </div>
                )}

                {/* Show message when auction is active but no bids */}
                {isAuctionActive && (!currentAuctionUrl || currentAuctionUrl.trim() === "") && (
                    <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                        <p className="text-sm text-yellow-300 text-center">
                            No bids placed yet - be the first to bid!
                        </p>
                    </div>
                )}
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
                        <p className="text-xs text-gray-400 mt-1">
                            This URL will be shown on the QR code if you win
                        </p>
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
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        {isBidding ? "Placing Bid..." : "Place Bid"}
                    </button>
                </div>
            ) : !isConnected ? (
                <div className="text-center py-6">
                    <p className="text-gray-400 mb-4">Connect your wallet to place bids</p>
                </div>
            ) : !isAuctionActive ? (
                <div className="text-center py-6">
                    <p className="text-gray-400 mb-2">Auction has ended</p>
                    <p className="text-sm text-gray-500">Waiting for next auction to start...</p>
                </div>
            ) : null}
        </div>
    )
}
