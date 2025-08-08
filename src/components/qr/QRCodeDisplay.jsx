"use client"
import { useEffect, useRef, useState } from "react"
import QRCodeLib from "qrcode"
import { useQRBidContract } from "../../hooks/useQRBidContract"

export default function QRCodeDisplay() {
    const canvasRef = useRef(null)
    const [qrError, setQrError] = useState(null)
    const { currentUrl, currentAuction, isAuctionActive } = useQRBidContract()

    // Default URL when no auction is active or no URL is set
    const defaultUrl = "https://github.com/Shreyassp002/"

    // Get URL from multiple sources for better reliability
    const getDisplayUrl = () => {
        // Priority 1: Direct currentUrl from contract
        if (currentUrl && currentUrl.trim() !== "") {
            return currentUrl
        }

        // Priority 2: URL from currentAuction struct
        if (currentAuction?.preferredUrl && currentAuction.preferredUrl.trim() !== "") {
            return currentAuction.preferredUrl
        }

        // Priority 3: Default URL
        return defaultUrl
    }

    const displayUrl = getDisplayUrl()

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

    // Debug logging
    useEffect(() => {
        console.log("QR Component Debug:", {
            currentUrl,
            currentAuctionUrl: currentAuction?.preferredUrl,
            displayUrl,
            isAuctionActive,
            hasCurrentAuction: !!currentAuction,
        })
    }, [currentUrl, currentAuction, displayUrl, isAuctionActive])

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

    const isShowingDefault = displayUrl === defaultUrl

    return (
        <div className="qr-card text-center">
            <h2 className="text-xl font-bold text-white mb-4">Live QR Code</h2>

            {/* Status Badge */}
            <div className="mb-4">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        isAuctionActive
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}
                >
                    {isAuctionActive ? "🔴 Live Auction" : "⏳ No Auction"}
                </span>
            </div>

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

            {/* URL Display */}
            <div className="mb-5">
                <p className="text-sm text-gray-300 mb-2">Destination:</p>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 break-all text-sm"
                    >
                        {displayUrl.length > 45 ? `${displayUrl.substring(0, 45)}...` : displayUrl}
                    </a>
                </div>
                {isShowingDefault ? (
                    <p className="text-sm text-gray-500 mt-2">Default - No bids yet</p>
                ) : (
                    <p className="text-sm text-green-400 mt-2">✨ Winner's destination</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center mb-4">
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                    📥 Save
                </button>

                <button
                    onClick={handleShare}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                    🔗 Share
                </button>

                <button
                    onClick={() => window.open(displayUrl, "_blank")}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                    🌐 Visit
                </button>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-400">
                <p>🔄 Updates automatically</p>
                {isAuctionActive && isShowingDefault && (
                    <p className="text-yellow-400 mt-1">⏳ Awaiting first bid</p>
                )}
            </div>
        </div>
    )
}
