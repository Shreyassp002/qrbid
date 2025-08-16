// src/lib/cryptoData.js

// Server-side function to fetch crypto data
export async function getCryptoData() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,polygon,avalanche-2,chainlink&vs_currencies=usd&include_24hr_change=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        // Cache for 30 seconds
        next: { revalidate: 30 }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    
    // Transform the data
    const cryptoData = Object.entries(data).map(([id, info]) => ({
      id,
      name: getCryptoName(id),
      symbol: getCryptoSymbol(id),
      price: info.usd,
      change24h: info.usd_24h_change
    }));

    return cryptoData;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // Return empty array if fetch fails
    return [];
  }
}

function getCryptoName(id) {
  const names = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'binancecoin': 'BNB',
    'cardano': 'Cardano',
    'solana': 'Solana',
    'polygon': 'Polygon',
    'avalanche-2': 'Avalanche',
    'chainlink': 'Chainlink'
  };
  return names[id] || id;
}

function getCryptoSymbol(id) {
  const symbols = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binancecoin': 'BNB',
    'cardano': 'ADA',
    'solana': 'SOL',
    'polygon': 'MATIC',
    'avalanche-2': 'AVAX',
    'chainlink': 'LINK'
  };
  return symbols[id] || id.toUpperCase();
}