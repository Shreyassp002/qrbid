import QRBidBackground from "../components/layout/QRBidBackground"
import AuctionDisplay from "../components/auction/AuctionDisplay"
import QRCodeDisplay from "../components/qr/QRCodeDisplay"

export default function Home() {
    return (
        <QRBidBackground>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-white">
                    QRBid Auction Platform
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <QRCodeDisplay />
                    <AuctionDisplay />
                </div>
            </div>
        </QRBidBackground>
    )
}
