"use client"
import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { formatEther } from "viem"
import { useQRBidContract } from "@/hooks/useQRBidContract"

export default function AdminPanel() {
    const { isConnected, address } = useAccount()
    const {
        owner,
        currentAuction,
        lastCompletedAuction,
        isAuctionActive,
        auctionCounter,
        timeRemaining,
        startAuction,
        endAuction,
        isStartingAuction,
        isEndingAuction,
        refetchAll,
    } = useQRBidContract()

    const [isOwner, setIsOwner] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    // Check if current user is owner
    useEffect(() => {
        if (address && owner) {
            setIsOwner(address.toLowerCase() === owner.toLowerCase())
        } else {
            setIsOwner(false)
        }
    }, [address, owner])

    // Initialize countdown
    useEffect(() => {
        if (timeRemaining) {
            setTimeLeft(Number(timeRemaining))
        }
    }, [timeRemaining])

    // Countdown timer
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

    const handleStartAuction = async () => {
        try {
            await startAuction()
            setTimeout(refetchAll, 3000) 
        } catch (error) {
            console.error("Failed to start auction:", error)
        }
    }

    const handleEndAuction = async () => {
        try {
            await endAuction()
            setTimeout(refetchAll, 3000) 
        } catch (error) {
            console.error("Failed to end auction:", error)
        }
    }

    
    if (!isConnected || !isOwner) {
        return null
    }

    const canEndAuction = currentAuction && timeLeft === 0 && !currentAuction.isEnded

    return (
        <div className="admin-card">
            <h2 className="text-xl font-bold text-white mb-4">🔧 Admin Panel</h2>

            {/* Owner Info */}
            <div className="mb-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <p className="text-green-300 text-sm font-medium mb-1">✅ Owner Access</p>
                <p className="text-white font-mono text-xs">{address}</p>
            </div>

            {/* Contract Stats */}
            <div className="mb-6 space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Contract Stats</h3>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Auctions:</span>
                    <span className="text-white font-bold">
                        {auctionCounter ? auctionCounter.toString() : "0"}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Status:</span>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isAuctionActive
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                        }`}
                    >
                        {isAuctionActive ? "Auction Running" : "No Active Auction"}
                    </span>
                </div>

                {isAuctionActive && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Time Remaining:</span>
                        <span className="text-white font-mono">
                            {timeLeft > 0
                                ? formatTimeRemaining(timeLeft)
                                : "Ended - Ready to close"}
                        </span>
                    </div>
                )}
            </div>

            {/* Current Auction Details */}
            {currentAuction && currentAuction.auctionId && (
                <div className="mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                    <h4 className="text-md font-semibold text-white mb-3">
                        Current Auction #{currentAuction.auctionId.toString()}
                    </h4>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-300">Started:</span>
                            <span className="text-white">
                                {new Date(
                                    Number(currentAuction.startingTime) * 1000,
                                ).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-300">Ends:</span>
                            <span className="text-white">
                                {new Date(
                                    Number(currentAuction.endingTime) * 1000,
                                ).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-300">Highest Bid:</span>
                            <span className="text-white font-bold">
                                {currentAuction.highestBid && currentAuction.highestBid > 0n
                                    ? `${formatEther(currentAuction.highestBid)} ETH`
                                    : "No bids"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-300">Winner:</span>
                            <span className="text-white font-mono text-xs">
                                {currentAuction.highestBidder &&
                                currentAuction.highestBidder !==
                                    "0x0000000000000000000000000000000000000000"
                                    ? `${currentAuction.highestBidder.slice(0, 6)}...${currentAuction.highestBidder.slice(-4)}`
                                    : "No winner yet"}
                            </span>
                        </div>

                        {currentAuction.preferredUrl && (
                            <div className="mt-3 p-2 bg-blue-900/20 rounded border border-blue-500/30">
                                <p className="text-blue-300 text-xs mb-1">Current URL:</p>
                                <a
                                    href={currentAuction.preferredUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-xs break-all"
                                >
                                    {currentAuction.preferredUrl}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Last Completed Auction */}
            {lastCompletedAuction && lastCompletedAuction.auctionId && (
                <div className="mb-6 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <h4 className="text-md font-semibold text-purple-300 mb-3">
                        Last Completed Auction #{lastCompletedAuction.auctionId.toString()}
                    </h4>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-300">Final Bid:</span>
                            <span className="text-white font-bold">
                                {lastCompletedAuction.highestBid &&
                                lastCompletedAuction.highestBid > 0n
                                    ? `${formatEther(lastCompletedAuction.highestBid)} ETH`
                                    : "No bids"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-300">Winner:</span>
                            <span className="text-white font-mono text-xs">
                                {lastCompletedAuction.highestBidder &&
                                lastCompletedAuction.highestBidder !==
                                    "0x0000000000000000000000000000000000000000"
                                    ? `${lastCompletedAuction.highestBidder.slice(0, 6)}...${lastCompletedAuction.highestBidder.slice(-4)}`
                                    : "No winner"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-300">URL Expires:</span>
                            <span className="text-white text-xs">
                                {lastCompletedAuction.urlExpiryTime
                                    ? new Date(
                                          Number(lastCompletedAuction.urlExpiryTime) * 1000,
                                      ).toLocaleString()
                                    : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Actions */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Actions</h3>

                {/* Start Auction Button */}
                <button
                    onClick={handleStartAuction}
                    disabled={isStartingAuction || isAuctionActive}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                        isAuctionActive
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-500 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isStartingAuction
                        ? "Starting..."
                        : isAuctionActive
                          ? "Auction Already Active"
                          : "🚀 Start New Auction"}
                </button>

                {/* End Auction Button */}
                <button
                    onClick={handleEndAuction}
                    disabled={isEndingAuction || !canEndAuction}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                        canEndAuction
                            ? "bg-red-600 hover:bg-red-500 text-white"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isEndingAuction
                        ? "Ending..."
                        : !isAuctionActive
                          ? "No Auction to End"
                          : timeLeft > 0
                            ? "Auction Still Running"
                            : currentAuction?.isEnded
                              ? "Auction Already Ended"
                              : "🏁 End Auction"}
                </button>

                {/* Refresh Data Button */}
                <button
                    onClick={refetchAll}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                    🔄 Refresh Data
                </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-300 text-sm font-medium mb-2">💡 Admin Tips</p>
                <ul className="text-yellow-200 text-xs space-y-1">
                    <li>• Starting a new auction automatically ends the current one</li>
                    <li>• Winner URLs display for 24 hours after auction ends</li>
                    <li>• You can start new auctions immediately after ending previous ones</li>
                    <li>• Contract handles URL transitions automatically</li>
                </ul>
            </div>
        </div>
    )
}
