// src/app/auction/layout.js
import Web3Provider from "@/providers/Web3Provider"
import Header from "@/components/Header"
import Background from "@/components/Background"
import CryptoTicker from "@/components/CryptoTicker"
import { getCryptoData } from "@/lib/cryptoData"

export default async function AuctionLayout({ children }) {
    // Fetch crypto data on the server for auction pages
    const initialCryptoData = await getCryptoData()

    return (
        <Web3Provider>
            <Background>
                <div className="min-h-screen flex flex-col">
                    <Header currentPage="auction" />

                    {/* Add padding top to account for fixed header (Header height ~88px) */}
                    <div className="pt-24">
                        {/* Crypto Ticker - now in normal document flow */}
                        <CryptoTicker initialData={initialCryptoData} />

                        {/* Children content */}
                        {children}
                    </div>
                </div>
            </Background>
        </Web3Provider>
    )
}
