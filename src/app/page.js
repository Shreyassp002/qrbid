import HeroSection from "@/components/landing/HeroSection"
import FeaturesGrid from "@/components/landing/FeaturesGrid"
import Footer from "@/components/Footer"
import Background from "@/components/landing/Background"
import Header from "@/components/Header"

export default function LandingPage() {
    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <Header />
                <HeroSection />
                <FeaturesGrid />
                <Footer />
            </div>
        </Background>
    )
}
