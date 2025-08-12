import Web3Provider from "@/providers/Web3Provider"

export default function AuctionLayout({ children }) {
    return <Web3Provider>{children}</Web3Provider>
}
