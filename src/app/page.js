import HeroSection from "@/components/landing/HeroSection"
import FeaturesGrid from "@/components/landing/FeaturesGrid"
import Footer from "@/components/Footer"
import Background from "@/components/Background"
import Header from "@/components/Header"
import PageTransition from "@/components/transitions/PageTransition"
import { Suspense } from "react"

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-pulse"></div>
                        <span className="text-white text-xl font-bold">QRBid</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="w-32 h-10 bg-blue-500/50 rounded-lg animate-pulse"></div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center pt-32">
                <div className="text-center">
                    <div className="w-64 h-12 bg-gray-700 rounded mb-4 animate-pulse mx-auto"></div>
                    <div className="w-48 h-8 bg-gray-700 rounded animate-pulse mx-auto"></div>
                </div>
            </div>
        </div>
    )
}

export default function LandingPage() {
    return (
        <Background>
            <Suspense fallback={<LoadingFallback />}>
                <div className="min-h-screen flex flex-col">
                    <Header currentPage="home" />
                    <PageTransition delay={150}>
                        <HeroSection />
                    </PageTransition>
                    <PageTransition delay={300}>
                        <FeaturesGrid />
                    </PageTransition>
                    <PageTransition delay={450}>
                        <Footer />
                    </PageTransition>
                </div>
            </Suspense>
        </Background>
    )
}
