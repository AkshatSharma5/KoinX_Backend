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
      const coinName = coin.id;
      const records = await Crypto.find({ coin: coinName }).sort({ timestamp: -1 }).limit(100);
      if (records && records.length > 0) {
        const prices = records.map(record => record.price);
        coin.deviation = calculateStdDev(prices);
      } else {
        coin.deviation = "N/A";
      }
    }

    // Render the homepage using the fetched coin data with a modern header & footer
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KryptoX</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        <style>
          /* Global Styles */
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #000000, #4b0082);
            font-family: 'Poppins', sans-serif;
            color: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          a {
            color: #fff;
            text-decoration: none;
          }
          /* Header */
          header {
            padding: 1rem 2rem;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          header .logo {
            font-size: 1.8rem;
            font-weight: 600;
          }
          nav ul {
            list-style: none;
            display: flex;
            gap: 1.5rem;
            margin: 0;
            padding: 0;
          }
          nav ul li {
            font-size: 1rem;
          }
          /* Main Content */
          .container {
            flex: 1;
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
          }
          .intro {
            text-align: center;
            margin-bottom: 2rem;
          }
          .intro h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }
          .intro p {
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
            border-radius: 50%;
            border: 2px solid #fff;
          }
          .crypto-card h3 {
            margin: 0.5rem 0;
            font-size: 1.2rem;
            font-weight: 600;
          }
          .crypto-card p {
            margin: 0.3rem 0;
            font-size: 0.95rem;
          }
          /* Footer */
          footer {
            background: rgba(0, 0, 0, 0.3);
            text-align: center;
            padding: 1rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 0.9rem;
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <header>
          <div class="logo">KryptoX</div>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Stats</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        </header>

        <!-- Main Content -->
        <div class="container">
          <section class="intro">
            <h1>Welcome to the KryptoX</h1>
            <p>Get instantly Real-time stats, deviations, and insights on the top cryptocurrencies in the world!</p>
          </section>
          <div class="search-box">
            <input type="text" id="searchInput" placeholder="Search cryptocurrency..." />
          </div>
          <div class="grid" id="cryptoGrid">
            ${coins.map(coin => {
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

        <!-- Footer -->
        <footer>
          <p>&copy; ${new Date().getFullYear()} KryptoX. All rights reserved.</p>
          <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </footer>

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
      console.error(`No data found for coin: \${coin}`);
      return res.status(404).json({ error: `No data found for coin: \${coin}` });
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
