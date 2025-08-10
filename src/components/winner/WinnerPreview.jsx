"use client"
import { useState, useEffect } from "react"
import { ExternalLink, Clock, Trophy } from "lucide-react"
import { formatEther } from "viem"
import { useQRBidContract } from "../../hooks/useQRBidContract"

export default function WinnerPreview() {
    const [urlTimeLeft, setUrlTimeLeft] = useState(0)

    const { qrUrl, qrUrlStatus, qrUrlExpiryTime, lastCompletedAuction } = useQRBidContract()

    // Only show if there's a winner URL 
    const hasWinnerUrl = qrUrl && qrUrl.trim() !== "" && qrUrlStatus?.status === "winner_display"

    // Update countdown for URL expiry
    useEffect(() => {
        if (qrUrlExpiryTime) {
            const now = Math.floor(Date.now() / 1000)
            const remaining = Number(qrUrlExpiryTime) - now
            setUrlTimeLeft(remaining > 0 ? remaining : 0)
        }
    }, [qrUrlExpiryTime])

    // Countdown timer for URL expiry
    useEffect(() => {
        if (urlTimeLeft <= 0) return

        const interval = setInterval(() => {
            setUrlTimeLeft((prevTime) => {
                const newTime = prevTime - 1
                return newTime <= 0 ? 0 : newTime
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [urlTimeLeft])

    // Format time remaining
    const formatTimeRemaining = (seconds) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Don't render if no winner URL is active
    if (!hasWinnerUrl || !lastCompletedAuction) {
        return null
    }

    return (
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">Winner Spotlight</h2>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                    24h Display
                </span>
            </div>

            {/* Winner Info */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Auction #:</span>
                    <span className="text-white font-mono">
                        {lastCompletedAuction.auctionId?.toString()}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Winner:</span>
                    <span className="text-white font-mono text-sm">
                        {lastCompletedAuction.highestBidder
                            ? `${lastCompletedAuction.highestBidder.slice(0, 8)}...${lastCompletedAuction.highestBidder.slice(-6)}`
                            : "No winner"}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Winning Bid:</span>
                    <span className="text-yellow-400 font-bold">
                        {lastCompletedAuction.highestBid
                            ? `${formatEther(lastCompletedAuction.highestBid)} ETH`
                            : "0 ETH"}
                    </span>
                </div>

                {/* Countdown */}
                {urlTimeLeft > 0 && (
                    <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-300 text-sm">Display expires in:</span>
                        </div>
                        <span className="text-yellow-300 font-mono font-bold">
                            {formatTimeRemaining(urlTimeLeft)}
                        </span>
                    </div>
                )}
            </div>

            {/* URL Preview */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-300">Winner's URL:</p>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                        Live on QR Code
                    </span>
                </div>

                <div className="bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center">
                        <a
                            href={qrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-blue-400 hover:text-blue-300 break-all text-sm p-3 pr-2"
                        >
                            {qrUrl}
                        </a>
                        <button
                            onClick={() => window.open(qrUrl, "_blank")}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded transition-all duration-200 border-l border-gray-600"
                            title="Visit Winner's Website"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <div className="text-center">
                <p className="text-sm text-blue-300">
                    🏆 This URL is currently displayed on the QR code
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Winner gets exclusive 24-hour display time
                </p>
            </div>
        </div>
    )
}
