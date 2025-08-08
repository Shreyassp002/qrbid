"use client"
import { useEffect, useRef, useState } from "react"
import { Download, Share2, ExternalLink } from "lucide-react"
import QRCodeLib from "qrcode"
import { useQRBidContract } from "../../hooks/useQRBidContract"

export default function QRCodeDisplay() {
    const canvasRef = useRef(null)
    const [qrError, setQrError] = useState(null)
    const [urlTimeLeft, setUrlTimeLeft] = useState(0)

    const {
        currentUrl,
        currentAuction,
        lastCompletedAuction,
        isAuctionActive,
        hasActiveUrl,
        currentUrlExpiryTime,
        getUrlStatus,
    } = useQRBidContract()

    // Default URL when no auction is active or no URL is set
    const defaultUrl = "https://x.com/Darkreyyy"

    // Get URL status and display information
    const urlStatus = getUrlStatus()

    // Get URL with contract-first priority (contract handles the 24h winner display logic)
    const getDisplayUrl = () => {
        // Priority 1: ALWAYS use currentUrl from contract first
        if (currentUrl && currentUrl.trim() !== "") {
            return currentUrl
        }

        // Priority 2: Fallback to default URL only if contract returns empty
        return defaultUrl
    }

    const displayUrl = getDisplayUrl()
    const isShowingDefault = displayUrl === defaultUrl

    // update countdown for URL expiry
    useEffect(() => {
        if (currentUrlExpiryTime) {
            const now = Math.floor(Date.now() / 1000)
            const remaining = Number(currentUrlExpiryTime) - now
            setUrlTimeLeft(remaining > 0 ? remaining : 0)
        }
    }, [currentUrlExpiryTime])

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

    // Generate QR code whenever URL changes
    useEffect(() => {
        const generateQR = async () => {
            if (!canvasRef.current || !displayUrl) return

            try {
                setQrError(null)
                await QRCodeLib.toCanvas(canvasRef.current, displayUrl, {
                    width: 220,
                    margin: 2,
                    color: {
                        dark: "#1f2937",
                        light: "#ffffff",
                    },
                    errorCorrectionLevel: "M",
                })
            } catch (error) {
                console.error("QR Code generation failed:", error)
                setQrError("Failed to generate QR code")
            }
        }

        generateQR()
    }, [displayUrl])

    // Debug
    useEffect(() => {
        console.log("QR Component Debug:", {
            contractCurrentUrl: currentUrl,
            displayUrl,
            isAuctionActive,
            hasActiveUrl,
            currentUrlExpiryTime: currentUrlExpiryTime?.toString(),
            urlTimeLeft,
            isShowingDefault,
        })
    }, [
        currentUrl,
        displayUrl,
        isAuctionActive,
        hasActiveUrl,
        currentUrlExpiryTime,
        urlTimeLeft,
        isShowingDefault,
    ])

    // Format time remaining
    const formatTimeRemaining = (seconds) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleDownload = () => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const link = document.createElement("a")
        link.download = `qrbid-qr-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    const handleShare = async () => {
        if (!navigator.share) {
            try {
                await navigator.clipboard.writeText(displayUrl)
                alert("URL copied!")
            } catch (error) {
                console.error("Failed to copy:", error)
            }
            return
        }

        try {
            await navigator.share({
                title: "QRBid Platform",
                url: displayUrl,
            })
        } catch (error) {
            console.error("Failed to share:", error)
        }
    }

    const handleVisit = () => {
        window.open(displayUrl, "_blank")
    }

    // display info based on contract state
    const getStatusDisplay = () => {
        const hasContractUrl = currentUrl && currentUrl.trim() !== "" && currentUrl !== defaultUrl

        if (isAuctionActive) {
            if (hasContractUrl) {
                return {
                    badge: "🔴 Live Auction",
                    badgeClass: "bg-green-500/20 text-green-300 border border-green-500/30",
                    subtitle: "Current highest bidder's URL",
                }
            } else {
                return {
                    badge: "🔴 Live Auction",
                    badgeClass: "bg-green-500/20 text-green-300 border border-green-500/30",
                    subtitle: "No bids yet",
                }
            }
        }

        // If no active auction but we have a URL from contract, it must be winner display
        if (hasContractUrl) {
            return {
                badge: "🏆 Winner Display",
                badgeClass: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                subtitle: `Winner's URL (${formatTimeRemaining(urlTimeLeft)} remaining)`,
            }
        }

        return {
            badge: "⏳ No Active URL",
            badgeClass: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
            subtitle: "Default URL - No active auction or winner",
        }
    }

    const statusDisplay = getStatusDisplay()

    return (
        <div className="qr-card text-center">
            {/* Status Badge */}
            <div className="mb-4">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusDisplay.badgeClass}`}
                >
                    {statusDisplay.badge}
                </span>
            </div>

            {/* Auction Info */}
            {isAuctionActive && currentAuction && (
                <div className="mb-4 text-sm">
                    <span className="text-gray-300">
                        Auction #{currentAuction.auctionId?.toString()}
                    </span>
                </div>
            )}

            {/* QR Code */}
            <div className="mb-4 flex justify-center">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                    {qrError ? (
                        <div className="w-[220px] h-[220px] bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="text-2xl mb-1">❌</div>
                                <p className="text-sm">{qrError}</p>
                            </div>
                        </div>
                    ) : (
                        <canvas ref={canvasRef} className="max-w-full h-auto" />
                    )}
                </div>
            </div>

            {/* URL Display with Integrated Action Icons */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-300">Destination:</p>
                    {!isShowingDefault && (
                        <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                            {isAuctionActive ? "Current Auction" : "Recent Winner"}
                        </span>
                    )}
                </div>

                <div className="bg-gray-800/50 rounded-lg border border-gray-600 mb-2">
                    <div className="flex items-center">
                        {/* URL Link - Takes most of the space */}
                        <a
                            href={displayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-blue-400 hover:text-blue-300 break-all text-sm p-3 pr-2"
                        >
                            {displayUrl.length > 35
                                ? `${displayUrl.substring(0, 35)}...`
                                : displayUrl}
                        </a>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 p-2 border-l border-gray-600">
                            <button
                                onClick={handleDownload}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all duration-200"
                                title="Download QR Code"
                            >
                                <Download className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-all duration-200"
                                title="Share URL"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleVisit}
                                className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded transition-all duration-200"
                                title="Visit Website"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <p className={`text-sm ${isShowingDefault ? "text-gray-500" : "text-green-400"}`}>
                    {statusDisplay.subtitle}
                </p>

                {/* URL expiry countdown - show only when displaying winner URL and not in active auction */}
                {!isAuctionActive && !isShowingDefault && urlTimeLeft > 0 && (
                    <div className="mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-yellow-300">Winner URL expires in:</span>
                            <span className="text-yellow-300 font-mono font-bold">
                                {formatTimeRemaining(urlTimeLeft)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Winner Display Info - show when not in active auction but showing winner URL */}
            {!isAuctionActive && !isShowingDefault && lastCompletedAuction && (
                <div className="mb-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30 text-sm">
                    <p className="text-blue-300 font-medium mb-2">
                        🏆 Current Winner (24h Display)
                    </p>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-300">Auction:</span>
                            <span className="text-white">
                                #{lastCompletedAuction.auctionId?.toString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Winner:</span>
                            <span className="text-white font-mono text-xs">
                                {lastCompletedAuction.highestBidder
                                    ? `${lastCompletedAuction.highestBidder.slice(0, 6)}...${lastCompletedAuction.highestBidder.slice(-4)}`
                                    : "No winner"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="text-sm text-gray-400">
                <p>🔄 Updates automatically</p>
                {!isAuctionActive && !isShowingDefault && (
                    <p className="mt-1">⏰ Winner gets 24h display time</p>
                )}
            </div>
        </div>
    )
}
