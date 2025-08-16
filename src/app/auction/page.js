import AuctionDisplay from "@/components/auction/auctionPanel/AuctionDisplay"
import QRCodeDisplay from "@/components/auction/qr/QRCodeDisplay"
import WinnerPreview from "@/components/auction/winner/WinnerPreview"
import AdminPanel from "@/components/auction/admin/AdminPanel"
import Footer from "@/components/Footer"
import PageTransition from "@/components/transitions/PageTransition"
import { Suspense } from "react"

// Loading fallback for auction components
function AuctionLoadingFallback() {
    return (
        <div className="min-h-screen">
            <main className="flex-1 p-8">
                <div className="text-center mb-12">
                    <div className="w-96 h-8 bg-gray-700 rounded animate-pulse mx-auto"></div>
                </div>

                <div className="max-w-6xl mx-auto mb-8">
                    <div className="h-20 bg-gray-800 rounded-2xl animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
                    <div className="h-80 bg-gray-800 rounded-2xl animate-pulse"></div>
                    <div className="h-80 bg-gray-800 rounded-2xl animate-pulse"></div>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="h-32 bg-gray-800 rounded-2xl animate-pulse"></div>
                </div>
            </main>

            <div className="h-16 bg-gray-900 animate-pulse"></div>
        </div>
    )
}

export default function Auction() {
    return (
        <Suspense fallback={<AuctionLoadingFallback />}>
            <main className="flex-1 p-8">
                <PageTransition delay={150}>
                    <div className="text-center mb-12">
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Bid to control where the QR code points!
                        </p>
                    </div>
                </PageTransition>

                <PageTransition delay={250}>
                    <div className="max-w-6xl mx-auto mb-8">
                        <Suspense
                            fallback={
                                <div className="h-20 bg-gray-800/50 rounded-2xl animate-pulse"></div>
                            }
                        >
                            <AdminPanel />
                        </Suspense>
                    </div>
                </PageTransition>

                <PageTransition delay={350}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
                        <Suspense
                            fallback={
                                <div className="h-80 bg-gray-800/50 rounded-2xl animate-pulse"></div>
                            }
                        >
                            <QRCodeDisplay />
                        </Suspense>
                        <Suspense
                            fallback={
                                <div className="h-80 bg-gray-800/50 rounded-2xl animate-pulse"></div>
                            }
                        >
                            <AuctionDisplay />
                        </Suspense>
                    </div>
                </PageTransition>

                <PageTransition delay={450}>
                    <div className="max-w-6xl mx-auto">
                        <Suspense
                            fallback={
                                <div className="h-32 bg-gray-800/50 rounded-2xl animate-pulse"></div>
                            }
                        >
                            <WinnerPreview />
                        </Suspense>
                    </div>
                </PageTransition>
            </main>

            <PageTransition delay={550}>
                <Footer />
            </PageTransition>
        </Suspense>
    )
}
