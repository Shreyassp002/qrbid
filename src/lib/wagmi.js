import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia, hardhat } from "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
    appName: "QRBid Auction Platform",
    projectId: "6410169ff9c5cd340536ca1f5f0ecb25", 
    chains: [sepolia, hardhat],
    ssr: true,
})
