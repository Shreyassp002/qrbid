import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { QR_BID_ABI, CONTRACT_ADDRESSES } from "../config/contracts"
import { sepolia } from "wagmi/chains"

export function useQRBidContract() {
    const contractAddress = CONTRACT_ADDRESSES.sepolia

    // Main QR URL 
    const { data: qrUrl, refetch: refetchQRUrl } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getQRUrl",
    })

    // Current auction URL 
    const { data: currentAuctionUrl, refetch: refetchCurrentAuctionUrl } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getCurrentAuctionUrl",
    })

    const { data: timeRemaining, refetch: refetchTimeRemaining } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getTimeRemaining",
    })

    const { data: isAuctionActive, refetch: refetchIsActive } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "isAuctionActive",
    })

    // QR has any URL currently active
    const { data: hasActiveQRUrl } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "hasActiveQRUrl",
    })

    // QR URL status
    const { data: qrUrlStatusRaw, refetch: refetchQRUrlStatus } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getQRUrlStatus",
    })

    // QR URL expiry time
    const { data: qrUrlExpiryTime, refetch: refetchQRUrlExpiryTime } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getQRUrlExpiryTime",
    })

    const qrUrlStatus = qrUrlStatusRaw
        ? {
              status: qrUrlStatusRaw[0],
              source: qrUrlStatusRaw[1],
          }
        : null

    // s_currentAuction returns an array
    const { data: currentAuctionRaw, refetch: refetchCurrentAuction } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "s_currentAuction",
    })

    // Last completed auction
    const { data: lastCompletedAuctionRaw, refetch: refetchLastCompleted } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "s_lastCompletedAuction",
    })

    const { data: owner } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "owner",
    })

    const { data: auctionCounter } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "s_auctionCounter",
    })

    // Convert array data into structured objects
    const currentAuction = currentAuctionRaw
        ? {
              auctionId: currentAuctionRaw[0],
              startingTime: currentAuctionRaw[1],
              endingTime: currentAuctionRaw[2],
              highestBid: currentAuctionRaw[3],
              highestBidder: currentAuctionRaw[4],
              preferredUrl: currentAuctionRaw[5],
              isEnded: currentAuctionRaw[6],
              urlExpiryTime: currentAuctionRaw[7],
          }
        : null

    const lastCompletedAuction = lastCompletedAuctionRaw
        ? {
              auctionId: lastCompletedAuctionRaw[0],
              startingTime: lastCompletedAuctionRaw[1],
              endingTime: lastCompletedAuctionRaw[2],
              highestBid: lastCompletedAuctionRaw[3],
              highestBidder: lastCompletedAuctionRaw[4],
              preferredUrl: lastCompletedAuctionRaw[5],
              isEnded: lastCompletedAuctionRaw[6],
              urlExpiryTime: lastCompletedAuctionRaw[7],
          }
        : null

    // Write functions
    const { writeContract: placeBid, isPending: isBidding } = useWriteContract()
    const { writeContract: startAuction, isPending: isStartingAuction } = useWriteContract()
    const { writeContract: endAuction, isPending: isEndingAuction } = useWriteContract()

    // Helper function to get auction by ID
    const getAuction = (auctionId) => {
        const { data: auctionRaw } = useReadContract({
            address: contractAddress,
            abi: QR_BID_ABI,
            functionName: "getAuction",
            args: [auctionId],
        })

        return auctionRaw
            ? {
                  auctionId: auctionRaw[0],
                  startingTime: auctionRaw[1],
                  endingTime: auctionRaw[2],
                  highestBid: auctionRaw[3],
                  highestBidder: auctionRaw[4],
                  preferredUrl: auctionRaw[5],
                  isEnded: auctionRaw[6],
                  urlExpiryTime: auctionRaw[7],
              }
            : null
    }

    // Refetch all data function
    const refetchAll = () => {
        refetchQRUrl()
        refetchCurrentAuctionUrl()
        refetchTimeRemaining()
        refetchIsActive()
        refetchCurrentAuction()
        refetchLastCompleted()
        refetchQRUrlStatus()
        refetchQRUrlExpiryTime()
    }

    return {
        // QR-specific data
        qrUrl, 
        currentAuctionUrl, 
        hasActiveQRUrl,
        qrUrlStatus,
        qrUrlExpiryTime,

        // Existing auction data
        timeRemaining,
        isAuctionActive,
        currentAuction,
        lastCompletedAuction,
        owner,
        auctionCounter,

        // Helper functions
        getAuction,
        refetchAll,

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
        isStartingAuction,
        isEndingAuction,
    }
}
