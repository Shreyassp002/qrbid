"use client"
import { useEffect, useRef, useState } from "react"
import QRCodeLib from "qrcode"
import { useQRBidContract } from "../../hooks/useQRBidContract"

export default function QRCodeDisplay() {
    const canvasRef = useRef(null)
    const [qrError, setQrError] = useState(null)
    const { currentUrl, isAuctionActive } = useQRBidContract()

    // Default URL when no auction is active or no URL is set
    const defaultUrl = "https://github.com/your-username/qrbid-platform"
    const displayUrl = currentUrl && currentUrl.trim() !== "" ? currentUrl : defaultUrl

    useEffect(() => {
        const generateQR = async () => {
            if (!canvasRef.current || !displayUrl) return

            try {
                setQrError(null)
                await QRCodeLib.toCanvas(canvasRef.current, displayUrl, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#1f2937", // Dark gray for QR code
                        light: "#ffffff", // White background
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
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(displayUrl)
                alert("URL copied to clipboard!")
            } catch (error) {
                console.error("Failed to copy to clipboard:", error)
            }
            return
        }

        try {
            await navigator.share({
                title: "QRBid Auction Platform",
                text: "Check out this QR code from QRBid!",
                url: displayUrl,
            })
        } catch (error) {
            console.error("Failed to share:", error)
        }
    }

    return (
        <div className="qr-card text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Live QR Code</h2>

            {/* Status Badge */}
            <div className="mb-4">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        isAuctionActive
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}
                >
                    {isAuctionActive ? "🔴 Live Auction" : "⏳ No Active Auction"}
                </span>
            </div>

            {/* QR Code */}
            <div className="mb-6 flex justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                    {qrError ? (
                        <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">❌</div>
                                <p className="text-sm">{qrError}</p>
                            </div>
                        </div>
                    ) : (
                        <canvas ref={canvasRef} className="max-w-full h-auto" />
                    )}
                </div>
            </div>

            {/* URL Display */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Current Destination:</p>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                    <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 break-all text-sm"
                    >
                        {displayUrl}
                    </a>
                </div>
                {displayUrl === defaultUrl && (
                    <p className="text-xs text-gray-500 mt-2">Default URL - No winning bid yet</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <span>📥</span>
                    Download
                </button>

                <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <span>🔗</span>
                    Share
                </button>

                <button
                    onClick={() => window.open(displayUrl, "_blank")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <span>🚀</span>
                    Visit
                </button>
            </div>

            {/* Info */}
            <div className="mt-6 text-xs text-gray-500 space-y-1">
                <p>🔄 QR Code updates automatically when auction changes</p>
                <p>📱 Scan with any QR code reader</p>
                {isAuctionActive && <p className="text-green-400">✨ Live auction in progress!</p>}
            </div>
        </div>
    )
}
