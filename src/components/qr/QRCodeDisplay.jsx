"use client"
import { useEffect, useRef, useState } from "react"
import { Download, Share2, ExternalLink } from "lucide-react"
import QRCodeLib from "qrcode"
import { useQRBidContract } from "../../hooks/useQRBidContract"
import SafeIframe from "./SafeIframe"

export default function QRCodeDisplay() {
    const canvasRef = useRef(null)
    const [qrError, setQrError] = useState(null)

    const { qrUrl } = useQRBidContract()

    // Default URL when contract returns empty (no winner URL active)
    const defaultUrl = "https://x.com/Darkreyyy"

    // QR shows ONLY winner URL or default - contract handles all logic
    const displayUrl = qrUrl && qrUrl.trim() !== "" ? qrUrl : defaultUrl
    const isShowingDefault = displayUrl === defaultUrl

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

    return (
        <div className="qr-card text-center">
            {/* Status Badge */}
            <div className="mb-4">
                <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                        isShowingDefault
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                >
                    {isShowingDefault ? "⏳ Default URL" : "🏆 Winner URL"}
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

            {/* URL Display with Integrated Action Icons */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-300">Destination:</p>
                    {!isShowingDefault && (
                        <span className="text-xs px-2 py-1 bg-blue-700 rounded text-blue-300">
                            Winner Display
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
                <SafeIframe src={displayUrl} />

                <p className={`text-sm ${isShowingDefault ? "text-gray-500" : "text-blue-400"}`}>
                    {isShowingDefault
                        ? "No winner URL active - showing default"
                        : "Winner's URL (24h display period)"}
                </p>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-400">
                <p>Updates automatically</p>
                <p className="mt-1">🏆 Winners get 24h display time</p>
            </div>
        </div>
    )
}
