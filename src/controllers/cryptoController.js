const Crypto = require("../models/Crypto");
const calculateStdDev = require("../utils/calculateStdDev");
const axios = require("axios");

const showIntroPage = async (req, res) => {
  try {
    // Fetch top 12 coins from CoinGecko API
    const coingeckoRes = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 12,
          page: 1,
          sparkline: false,
        },
      }
    );
    const coins = coingeckoRes.data;

    // For each coin, try to calculate deviation from DB records
    for (const coin of coins) {
      // For coins like "matt" that may not exist on CoinGecko, use lowercase name match.
      const coinName = coin.id; // CoinGecko returns ids like "bitcoin", "ethereum", etc.
      const records = await Crypto.find({ coin: coinName }).sort({ timestamp: -1 }).limit(100);
      if (records && records.length > 0) {
        const prices = records.map(record => record.price);
        coin.deviation = calculateStdDev(prices);
      } else {
        coin.deviation = "N/A";
      }
    }

    // Render the homepage using the fetched coin data
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Crypto Dashboard</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #000000, #4b0082);
            font-family: "Poppins", sans-serif;
            color: #fff;
            min-height: 100vh;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }
          .header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .header h1 {
            font-size: 3rem;
            color: #f0f0f0;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          .header p {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
          }
          .search-box {
            margin: 0 auto 2rem;
            max-width: 500px;
            text-align: center;
          }
          #searchInput {
            width: 100%;
            padding: 0.8rem 1rem;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
            font-size: 1rem;
            outline: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          .crypto-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .crypto-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }
          .crypto-logo {
            width: 60px;
            height: 60px;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Crypto Dashboard</h1>
            <p>Real-time stats, deviations, and more for your favorite coins</p>
          </div>
          <div class="search-box">
            <input type="text" id="searchInput" placeholder="Search cryptocurrency..." />
          </div>
          <div class="grid" id="cryptoGrid">
            ${coins.map(coin => {
              // Use CoinGecko's image; for "matt" (or any coin missing a valid image), use a fallback.
              let logo = coin.image;
              if (coin.id === "matt" || !logo) {
                logo = "https://via.placeholder.com/60?text=MATT";
              }
              return `
                <div class="crypto-card">
                  <img class="crypto-logo" src="${logo}" alt="${coin.name} logo" />
                  <h3>${coin.name.toUpperCase()}</h3>
                  <p>Price: $${coin.current_price.toFixed(2)}</p>
                  <p>Market Cap: $${coin.market_cap.toLocaleString()}</p>
                  <p>24h Change: <span style="color: ${coin.price_change_percentage_24h >= 0 ? '#4CAF50' : '#FF5252'}">
                      ${coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : 'N/A'}%
                  </span></p>
                  <p>Deviation: ${typeof coin.deviation === 'number' ? '$' + coin.deviation : coin.deviation}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <script>
          document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.crypto-card').forEach(card => {
              const name = card.querySelector('h3').textContent.toLowerCase();
              card.style.display = name.includes(searchTerm) ? 'block' : 'none';
            });
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error in showIntroPage:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

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
      coin: latestData.coin,
      price: latestData.price,
      marketCap: latestData.marketCap,
      change24h: latestData.change24h,
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
    const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);
    const prices = records.map(record => record.price);
    if (!prices.length) {
      return res.status(500).json({ error: "No valid prices available for calculation." });
    }
    const deviation = calculateStdDev(prices);
    res.json({ deviation });
  } catch (error) {
    console.error("Error in getDeviation:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { showIntroPage, getStats, getDeviation };
