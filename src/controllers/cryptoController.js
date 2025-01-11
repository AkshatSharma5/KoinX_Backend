// const Crypto = require('../models/Crypto');
// const calculateStdDev = require('../utils/calculateStdDev');
// const getStats = async (req, res) => {
//     try {
//         const { coin } = req.query;
//         if (!coin) return res.status(400).json({ error: 'Coin is required.' });

//         const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

//         if (!latestData) return res.status(404).json({ error: 'No data found for this coinnn.' });

//         res.json({
//             price: latestData.price,
//             marketCap: latestData.marketCap,
//             '24hChange': latestData.change24h
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const getDeviation = async (req, res) => {
//     try {
//         const { coin } = req.query;

//         if (!coin) return res.status(400).json({ error: 'Coin is required.' });

//         const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

//         if (records.length === 0) return res.status(404).json({ error: 'No data found for this coin!!.' });

//         const prices = records.map(record => record.price);
//         const deviation = calculateStdDev(prices);

//         res.json({ deviation });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {getStats, getDeviation}

const Crypto = require("../models/Crypto");
const calculateStdDev = require("../utils/calculateStdDev");

const getStats = async (req, res) => {
  try {
    const { coin } = req.query;

    if (!coin) {
      console.error("Coin query parameter is missing.");
      return res.status(400).json({ error: "Coin is required." });
    }

    const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

    if (!latestData) {
      console.error(`No data found for coin: ${coin}`);
      return res.status(404).json({ error: `No data found for coin: ${coin}` });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      "24hChange": latestData.change24h,
    });
  } catch (error) {
    console.error("Error in getStats:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getDeviation = async (req, res) => {
    try {
      const { coin } = req.query;
  
      if (!coin) {
        console.error("Coin query parameter is missing.");
        return res.status(400).json({ error: "Coin is required." });
      }
  
      // Fetch records
      const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);
      console.log("Number of records fetched:", records.length);
  
      if (records.length === 0) {
        console.error(`No data found for coin: ${coin}`);
        return res.status(404).json({ error: `No data found for coin: ${coin}` });
      }
  
      // Extract prices
      const prices = records.map((record) => record.price);
      console.log("Prices for deviation:", prices);
  
      if (!prices.length) {
        return res.status(500).json({ error: "No valid prices available for calculation." });
      }
  
      // Calculate deviation
      const deviation = calculateStdDev(prices);
      console.log("Calculated deviation:", deviation);
  
      res.json({ deviation });
    } catch (error) {
      console.error("Error in getDeviation:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = { getStats, getDeviation };
