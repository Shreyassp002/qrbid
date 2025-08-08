import { useReadContract, useWriteContract, useWatchContractEvent } from "wagmi"
import { QR_BID_ABI, CONTRACT_ADDRESSES } from "../config/contracts"
import { sepolia } from "wagmi/chains"

export function useQRBidContract() {
    const contractAddress = CONTRACT_ADDRESSES.sepolia

    // Read functions
    const { data: currentUrl, refetch: refetchCurrentUrl } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getCurrentUrl",
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

    // Check if there's any valid URL (from active auction or last completed within 24h)
    const { data: hasActiveUrl } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "hasActiveUrl",
    })

    // Get URL expiry time
    const { data: currentUrlExpiryTime } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "getCurrentUrlExpiryTime",
    })

    // s_currentAuction returns an array 
    const { data: currentAuctionRaw, refetch: refetchCurrentAuction } = useReadContract({
        address: contractAddress,
        abi: QR_BID_ABI,
        functionName: "s_currentAuction",
    })

    // Last completed auction
    const { data: lastCompletedAuctionRaw } = useReadContract({
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

    // Convert array data into structured objects with NEW fields
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

    // Helper function to determine URL status
    const getUrlStatus = () => {
        if (isAuctionActive && currentAuction?.preferredUrl) {
            return {
                status: "auction_active",
                source: "Current Auction",
                url: currentAuction.preferredUrl,
                expiryTime: currentUrlExpiryTime,
            }
        }

        if (hasActiveUrl && lastCompletedAuction?.preferredUrl) {
            const now = Math.floor(Date.now() / 1000)
            if (lastCompletedAuction.urlExpiryTime && now < lastCompletedAuction.urlExpiryTime) {
                return {
                    status: "winner_display",
                    source: "Recent Winner",
                    url: lastCompletedAuction.preferredUrl,
                    expiryTime: lastCompletedAuction.urlExpiryTime,
                }
            }
        }

        return {
            status: "no_url",
            source: null,
            url: null,
            expiryTime: null,
        }
    }

    // Refetch all data function
    const refetchAll = () => {
        refetchCurrentUrl()
        refetchTimeRemaining()
        refetchIsActive()
        refetchCurrentAuction()
    }

    return {
        // Read data
        currentUrl,
        timeRemaining,
        isAuctionActive,
        currentAuction,
        lastCompletedAuction,
        hasActiveUrl,
        currentUrlExpiryTime,
        owner,
        auctionCounter,

        // Helper functions
        getUrlStatus,
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
