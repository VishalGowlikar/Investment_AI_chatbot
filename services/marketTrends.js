const axios = require("axios");
const FMP_API_KEY = "9Q7DfCBFAwLHy0kJOtqAWCNc5uxnOhna";

module.exports.getTrends = async () => {
  try {
    const [sectors] = await Promise.all([
      axios.get(
        `https://financialmodelingprep.com/api/v4/sectors-performance?apikey=${FMP_API_KEY}`
      ),
    ]);

    return sectors.data.map((sector) => ({
      sector: sector.sector,
      change: sector.changesPercentage,
      trend: sector.changesPercentage > 0 ? "Gaining" : "Declining",
      newsSentiment: sector.changesPercentage > 0 ? "Positive" : "Negative",
    }));
  } catch {
    return [];
  }
};
