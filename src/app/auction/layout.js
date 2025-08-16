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

                    {/* Crypto Ticker positioned right below header - stays fixed */}
                    <div className="fixed top-[88px] left-0 right-0 z-40">
                        <CryptoTicker initialData={initialCryptoData} />
                    </div>

                    {/* Add top margin to account for fixed header + crypto ticker */}
                    <div className="pt-36">{children}</div>
                </div>
            </Background>
        </Web3Provider>
    )
}
