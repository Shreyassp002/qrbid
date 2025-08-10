import QRBidBackground from "@/components/layout/QRBidBackground"
import Header from "@/components/layout/Header"
import AuctionDisplay from "@/components/auction/AuctionDisplay"
import QRCodeDisplay from "@/components/qr/QRCodeDisplay"
import WinnerPreview from "@/components/winner/WinnerPreview"
import AdminPanel from "@/components/admin/AdminPanel"
import Footer from "@/components/layout/Footer"

export default function Home() {
    return (
        <QRBidBackground>
            {/* Full height container with flex layout */}
            <div className="min-h-screen flex flex-col">
                <Header />

                {/* Main content area that grows to push footer down */}
                <main className="flex-1 p-8">
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
        </QRBidBackground>
    )
}
