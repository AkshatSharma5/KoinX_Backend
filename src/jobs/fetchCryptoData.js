const axios = require('axios');
const Crypto = require('../models/Crypto');
const dotenv = require('dotenv');

dotenv.config();

const fetchCryptoData = async () => {
    try {
        const response = await axios.get(`${process.env.COINGECKO_API_BASE_URL}/simple/price`, {
            params: {
                ids: 'bitcoin,ethereum,matic',
                vs_currencies: 'usd',
                include_market_cap: true,
                include_24hr_change: true
            },
            headers: {
                'X-Cg-Pro-Api-Key': process.env.COINGECKO_API_KEY
            }
        });

        const data = response.data;

        for (const coin of Object.keys(data)) {
            const coinData = data[coin];
            await Crypto.create({
                coin,
                price: coinData.usd,
                marketCap: coinData.usd_market_cap,
                change24h: coinData.usd_24h_change
            });
        }

        console.log('Crypto data fetched and saved successfully.');
    } catch (err) {
        console.error('Error fetching crypto data:', err.message);
    }
};

module.exports = fetchCryptoData;
