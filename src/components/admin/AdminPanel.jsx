"use client"
import { useAccount } from "wagmi"
import { useQRBidContract } from "../../hooks/useQRBidContract"

export default function AdminPanel() {
    const { address } = useAccount()
    const { startAuction, endAuction, isAuctionActive, owner } = useQRBidContract()

    const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()
    if (!isOwner) {
        return null // admin panel
    }

    return (
        <div className="glass-card mb-8 border-yellow-500/20">
            <h3 className="text-lg font-bold text-yellow-300 mb-4">Admin Panel</h3>
            <div className="flex gap-4">
                <button
                    onClick={startAuction}
                    disabled={isAuctionActive}
                    className="btn-primary disabled:opacity-50"
                >
                    Start New Auction
                </button>
                <button
                    onClick={endAuction}
                    disabled={!isAuctionActive}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                    End Current Auction
                </button>
            </div>
        </div>
    )
}
