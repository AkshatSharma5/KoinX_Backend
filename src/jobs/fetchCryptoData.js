const axios = require("axios");
const Crypto = require("../models/Crypto");

const fetchCryptoData = async () => {
  try {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,cardano,polkadot,chainlink,stellar,litecoin,matic,cosmos,monero,tezos&vs_currencies=usd&include_market_cap=true&include_24hr_change=true";
    const response = await axios.get(url);
    const data = response.data;

    if (!data) {
      console.error("No data fetched from API.");
      return;
    }

    console.log("Fetched data:", data);

    for (const [coin, details] of Object.entries(data)) {
      const { usd: price, usd_market_cap: marketCap, usd_24h_change: change24h } = details;
      const cryptoData = new Crypto({
        coin,
        price,
        marketCap,
        change24h,
        timestamp: new Date()
      });
      await cryptoData.save();
      console.log("Data for " + coin + " saved to MongoDB.");
    }
    console.log("All data saved successfully.");
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
};

module.exports = { fetchCryptoData };
