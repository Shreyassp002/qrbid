import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia, hardhat } from "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
    appName: "QRBid Auction Platform",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    chains: [sepolia, hardhat],
    ssr: true,
})
