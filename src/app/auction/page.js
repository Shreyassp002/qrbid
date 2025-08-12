import Background from "@/components/landing/Background"
import Header from "@/components/Header"
import AuctionDisplay from "@/components/auction/auctionPanel/AuctionDisplay"
import QRCodeDisplay from "@/components/auction/qr/QRCodeDisplay"
import WinnerPreview from "@/components/auction/winner/WinnerPreview"
import AdminPanel from "@/components/auction/admin/AdminPanel"
import Footer from "@/components/Footer"

export default function Auction() {
    return (
        <Background>
            {/* Full height container with flex layout */}
            <div className="min-h-screen flex flex-col">
                <Header currentPage="auction" />

                {/* Main content area that grows to push footer down */}
                <main className="flex-1 p-8 pt-24">
                    <div className="text-center mb-12">
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Bid to control where the QR code points!
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto mb-8">
                        <AdminPanel />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
                        <QRCodeDisplay />
                        <AuctionDisplay />
                    </div>

                    {/* Winner Preview - Full width below main grid */}
                    <div className="max-w-6xl mx-auto">
                        <WinnerPreview />
                    </div>
                </main>

                {/* Footer stays at bottom */}
                <Footer />
            </div>
        </Background>
    )
}
