import { CoinData } from '../types';
import { COINGECKO_API_URL, MOCK_COINS } from '../constants';

// We use the public API by default.
// In a production environment, you would use a backend proxy or inject an API key securely.
export const fetchMarketData = async (page: number = 1): Promise<CoinData[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}&sparkline=true&price_change_percentage=24h`
    );

    if (!response.ok) {
      // API Limit reached or other error
      console.warn("CoinGecko API limit reached or error, falling back to mock data.");
      return generateMockDataWithVariation();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network error fetching coin data:", error);
    return generateMockDataWithVariation();
  }
};

// Helper to make the mock data feel a bit alive on refresh if API fails
const generateMockDataWithVariation = (): CoinData[] => {
  return MOCK_COINS.map(coin => ({
    ...coin,
    current_price: coin.current_price * (1 + (Math.random() * 0.02 - 0.01)),
    price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() * 1 - 0.5),
  }));
};