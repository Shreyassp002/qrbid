import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { QR_BID_ABI, CONTRACT_ADDRESSES } from "../config/contracts"
import { sepolia } from "wagmi/chains"

export function useQRBidContract() {
    const contractAddress = CONTRACT_ADDRESSES.sepolia // or dynamic based on chain

    // Read functions
    const { data: currentUrl } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getCurrentUrl",
    })

    const { data: timeRemaining } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getTimeRemaining",
    })

    const { data: isAuctionActive } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "isAuctionActive",
    })

    const { data: currentAuction } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "s_currentAuction",
    })

    // Write functions
    const { writeContract: placeBid, isPending: isBidding } = useWriteContract()
    const { writeContract: startAuction } = useWriteContract()
    const { writeContract: endAuction } = useWriteContract()

    return {
        // Read data
        currentUrl,
        timeRemaining,
        isAuctionActive,
        currentAuction,

        // Write functions
        placeBid: (url, value) =>
            placeBid({
                address: contractAddress,
                abi: QR_BID_ABI,
                functionName: "placeBid",
                args: [url],
                value,
            }),
        startAuction: () =>
            startAuction({
                address: contractAddress,
                abi: QR_BID_ABI,
                functionName: "startAuction",
            }),
        endAuction: () =>
            endAuction({
                address: contractAddress,
                abi: QR_BID_ABI,
                functionName: "endAuction",
            }),

        // Status
        isBidding,
    }
}
