const axios = require("axios");
const CryptoStats = require("../models/Crypto");

const fetchCryptoData = async () => {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cmatic&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;
    const response = await axios.get(url, {
      headers: {
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY,
        accept: "application/json",
      },
    });

    const data = response.data;
    console.log("Fetched data:", data);

    // Save data to the database
    const coins = Object.keys(data);
    for (const coin of coins) {
      const {
        usd: price,
        usd_market_cap: marketCap,
        usd_24h_change: change24h,
      } = data[coin];
      const newStat = new CryptoStats({
        coin,
        price,
        marketCap,
        change24h,
      });
      await newStat.save();
      console.log(`Saved data for ${coin}:`, newStat);
    }
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
};

module.exports = { fetchCryptoData };
