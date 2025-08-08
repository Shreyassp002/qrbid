import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { QR_BID_ABI, CONTRACT_ADDRESSES } from "../config/contracts"
import { sepolia } from "wagmi/chains"

export function useQRBidContract() {
    const contractAddress = CONTRACT_ADDRESSES.sepolia

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

    // s_currentAuction returns an array
    const { data: currentAuctionRaw } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "s_currentAuction",
    })

    const { data: owner } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "owner", // This comes from OpenZeppelin Ownable
    })

    // array data into a structured object
    const currentAuction = currentAuctionRaw
        ? {
              startingTime: currentAuctionRaw[0],
              endingTime: currentAuctionRaw[1],
              highestBid: currentAuctionRaw[2],
              highestBidder: currentAuctionRaw[3],
              preferredUrl: currentAuctionRaw[4],
              isEnded: currentAuctionRaw[5],
          }
        : null

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
        owner,

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
