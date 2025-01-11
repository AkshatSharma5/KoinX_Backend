const Crypto = require("../models/Crypto");
const calculateStdDev = require("../utils/calculateStdDev");
const showIntroPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Oswald:wght@200..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Crypto Tracker</title>
      <style>
        body {
          font-family: "Josefin Sans",oswald, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(to bottom right, #1a1a2e, #16213e);
          color: #fff;
          text-align: center;
        }
          .positive-change {
          color: #4CAF50 !important;
        }
        .negative-change {
          color: #FF5252 !important;
        }
        .container {
          padding: 2rem;
        }
        .dropdown {
          margin-top: 20px;
        }
        select {
          padding: 10px;
          font-size: 1rem;
        }
        .btn {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #0f3460;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn:hover {
          background-color: #e94560;
        }
        footer {
          margin-top: 50px;
          font-size: 0.9rem;
        }
        .dropdown {
          margin: 30px auto;
          margin-bottom: 10px;
          max-width: 300px;
          position: relative;
        }

        .dropdown label {
          display: block;
          margin-bottom: 12px;
          font-size: 1.2rem;
          font-weight: 500;
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .dropdown select {
          width: 100%;
          padding: 12px 20px;
          font-size: 1.1rem;
          font-family: 'Josefin Sans', sans-serif;
          color: #1a1a2e;
          background: linear-gradient(145deg, #FFDAB9, #FFE4B5);
          border: 1px dotted  #FFB347;
          border-radius: 12px;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          box-shadow: 0 4px 15px rgba(255, 179, 71, 0.2);
          transition: all 0.3s ease;
        }

        /* Custom dropdown arrow */
        .dropdown::after {
          content: '▼';
          font-size: 0.8rem;
          color: #1a1a2e;
          position: absolute;
          right: 20px;
          top: 50px;
          pointer-events: none;
        }

        .dropdown select:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 179, 71, 0.3);
          border-color: #FFD700;
        }

        .dropdown select:focus {
          outline: none;
          border-color: #FFD700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
        }

        /* Style for the options */
        .dropdown select option {
          background: #FFDAB9;
          color: #1a1a2e;
          padding: 12px;
          font-size: 1.1rem;
        }
          @keyframes slowBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes underlineBounce {
        0%, 100% {
          transform: translateX(-50%) scaleX(1);
        }
        50% {
          transform: translateX(-50%) scaleX(0.9);
        }
      }

      h1 {
        position: relative;
        display: inline-block;
        padding-bottom: 10px;
        margin-bottom: 20px;
        animation: slowBounce 4s ease-in-out infinite;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      h1::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        height: 4px;
        background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
        animation: underlineBounce 4s ease-in-out infinite;
      }
        canvas#particle-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .container {
          position: relative;
          z-index: 1;
        }
      </style>
    </head>
    <body>
    <canvas id="particle-canvas"></canvas>
      <div class="container">
        <h1>Welcome to Crypto Tracker</h1>
        <p>Track real-time cryptocurrency statistics and deviations</p>
        <div class="dropdown">
        <label for="currencies">Select a Cryptocurrency</label>
        <select id="currencies">
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
        </select>
      </div>
      <div>
      <button class="btn" onclick="fetchStats()">Get Stats</button>
      <button class="btn" onclick="fetchDeviation()">Get Deviation</button>
      </div>
      
      <p id="output"></p>
      </div>
      <footer>
        &copy; 2025 Crypto Tracker | All rights reserved.
      </footer>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle properties
  const particles = [];
  const particleCount = 100;
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = Math.random() * 0.2 - 0.1;
      this.vy = Math.random() * 0.2 - 0.1;
      this.size = Math.random() * 2;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }
  }
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Draw lines between nearby particles
  function drawLines(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      ctx.beginPath();
      ctx.strokeStyle = \`rgba(255, 255, 255, \${0.2 * (1 - distance / 100)})\`;
      ctx.lineWidth = 0.5;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
      
      particles.forEach(otherParticle => {
        if (particle !== otherParticle) {
          drawLines(particle, otherParticle);
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
});



        function formatMarketCap(value) {
          const n = numeral(value);
          if (value >= 1e12) return n.format('$0.00a').toUpperCase(); // Trillion
          if (value >= 1e9) return n.format('$0.00b').toUpperCase(); // Billion
          if (value >= 1e6) return n.format('$0.00m').toUpperCase(); // Million
          return n.format('$0,0'); // Less than a million
        }

        function formatPercentage(value) {
          return numeral(value).format('0.00') + '%';
        }

        function formatPrice(value) {
          return numeral(value).format('$0,0.00');
        }
        function fetchDeviation(){
          const currency = document.getElementById('currencies').value;
          fetch('/api/deviation?coin=' + currency)
            .then(response => response.json())
            .then(data => {
              alert(\` 💵 The deviation of \${currency} is \${data.deviation} 💵 \`);
            })
            .catch(err => {
              alert('Error fetching deviation: ' + err.message);
            });
        }

        function fetchStats() {
          const currency = document.getElementById('currencies').value;
          fetch('/api/stats?coin=' + currency)
            .then(response => response.json())
            .then(data => {
              const change24h = parseFloat(data['24hChange']);
              const changeClass = change24h >= 0 ? 'positive-change' : 'negative-change';
              const changeSymbol = change24h >= 0 ? '+' : '';

              document.getElementById('output').innerHTML = \`
                <table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 20px auto; background-color: #0f3460;">
                  <tr>
                    <td style="border: 1px dotted white; padding: 10px; color: #FFA500;"><strong>Price</strong></td>
                    <td style="border: 1px dotted  white; padding: 10px; color: white;">\${formatPrice(data.price)}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px dotted  white; padding: 10px; color: #FFA500;"><strong>Market Capital</strong></td>
                    <td style="border: 1px dotted  white; padding: 10px; color: white;">\${formatMarketCap(data.marketCap)}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px dotted  white; padding: 10px; color: #FFA500;"><strong>24 Hours Change</strong></td>
                    <td style="border: 1px dotted  white; padding: 10px;" class="\${changeClass}">
                      \${changeSymbol} \${formatPercentage(data['24hChange'])}
                    </td>
                  </tr>
                </table>
              \`;
            })
            .catch(err => {
              document.getElementById('output').textContent = 'Error fetching stats: ' + err.message;
            });
        }
      </script>
    </body>
    
    </html>
  `);
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
    const records = await Crypto.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100);
    console.log("Number of records fetched:", records.length);

    if (records.length === 0) {
      console.error(`No data found for coin: ${coin}`);
      return res.status(404).json({ error: `No data found for coin: ${coin}` });
    }

    // Extract prices
    const prices = records.map((record) => record.price);
    console.log("Prices for deviation:", prices);

    if (!prices.length) {
      return res
        .status(500)
        .json({ error: "No valid prices available for calculation." });
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

module.exports = { showIntroPage, getStats, getDeviation };
