export const QR_BID_ABI = [
    // Your contract ABI goes here - copy from artifacts/contracts/QRBid.sol/QRBid.json
]

export const CONTRACT_ADDRESSES = {
    sepolia: "0x...", // Your deployed contract address
    localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default Hardhat address
}

export const SUPPORTED_CHAINS = [
    {
        id: 11155111, // Sepolia
        name: "Sepolia",
        rpcUrls: ["https://rpc.sepolia.org"],
    },
]
