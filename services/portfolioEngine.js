const axios = require("axios");
const FMP_API_KEY = "9Q7DfCBFAwLHy0kJOtqAWCNc5uxnOhna";

async function getPrice(symbol) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
    const response = await axios.get(url);
    return response.data[0]?.price || 100;
  } catch {
    return 100;
  }
}

async function analyze(portfolio) {
  return await Promise.all(
    portfolio.map(async (asset) => {
      const currentPrice = await getPrice(asset.symbol);
      const value = currentPrice * asset.quantity;
      const profitLoss =
        ((currentPrice - asset.buyPrice) / asset.buyPrice) * 100;

      return {
        ...asset,
        currentPrice,
        value,
        profitLossPercent: profitLoss.toFixed(2),
        assetType: ["BTC", "ETH"].includes(asset.symbol) ? "crypto" : "stock",
      };
    })
  );
}

module.exports = { analyze };
