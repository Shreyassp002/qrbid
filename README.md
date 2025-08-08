[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![RainbowKit](https://img.shields.io/badge/RainbowKit-2.2.8-ff6b35.svg)](https://www.rainbowkit.com/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.16.0-purple.svg)](https://wagmi.sh/)

# QRBid Frontend

**Live Website**: https://qrbid.vercel.app/
**Smart Contracts**: https://github.com/Shreyassp002/qrbid-smartcontract

## Project Overview

The QRBid frontend provides an intuitive interface for users to participate in decentralized QR code auctions. Built with Next.js and Web3 technologies, it offers seamless wallet connection and real-time auction interaction.

### Key Features

- **Wallet Integration**: Connect with multiple wallets via RainbowKit
- **Real-time Updates**: Live auction status and countdown timers
- **Bid Placement**: Easy ETH bidding with URL submission
- **Responsive Design**: Mobile-first responsive interface

## Tech Stack

- **Framework**: Next.js with App Router
- **React**: 19.1.0 (Latest)
- **Styling**: Tailwind CSS v4
- **Web3**: Wagmi + Viem
- **Wallet Connect**: RainbowKit
- **State Management**: TanStack React Query
- **Icons**: Lucide React
- **Development**: ESLint + Prettier
- **Package Manager**: Yarn

## Prerequisites

- Node.js >= 18.0.0
- Yarn 1.22.22+
- Web3 wallet (MetaMask, WalletConnect, etc.)

## Installation

```bash
# Clone the repository
git clone https://github.com/Shreyassp002/qrbid.git
cd qrbid

# Install dependencies
yarn install

```

## Development

```bash
# Start development server with Turbopack
yarn dev

# Build for production
yarn build

# Start production server
yarn start

```

## Smart Contract Integration

The frontend integrates with QRBid smart contracts deployed on:

- **Sepolia Testnet**: Development and testing
