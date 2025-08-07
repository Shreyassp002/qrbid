export const QR_BID_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_platformWallet",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        inputs: [],
        name: "ReentrancyGuardReentrantCall",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
            },
            {
                indexed: true,
                internalType: "address",
                name: "winner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "winningAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "winningUrl",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "AuctionEnded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "startTime",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "endTime",
                type: "uint256",
            },
        ],
        name: "AuctionStarted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "bidder",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "url",
                type: "string",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        name: "BidPlaced",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "AUCTION_DURATION",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "endAuction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentUrl",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getTimeRemaining",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "i_platformWallet",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "isAuctionActive",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "minBidIncrement",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "minStartingBid",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_preferredUrl",
                type: "string",
            },
        ],
        name: "placeBid",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "s_auctionCounter",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "s_currentAuction",
        outputs: [
            {
                internalType: "uint256",
                name: "startingTime",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "endingTime",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "highestBid",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "highestBidder",
                type: "address",
            },
            {
                internalType: "string",
                name: "preferredUrl",
                type: "string",
            },
            {
                internalType: "bool",
                name: "isEnded",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_newIncrement",
                type: "uint256",
            },
        ],
        name: "setMinBidIncrement",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_newStartingBid",
                type: "uint256",
            },
        ],
        name: "setMinStartingBid",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "startAuction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]

export const CONTRACT_ADDRESSES = {
    sepolia: "0x26a3CeAd57c76ed576C7b29D2Df18E54F5bbD2C9", // Your deployed contract address
    localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default Hardhat address
}

export const SUPPORTED_CHAINS = [
    {
        id: 11155111, // Sepolia
        name: "Sepolia",
        rpcUrls: ["https://rpc.sepolia.org"],
    },
]
