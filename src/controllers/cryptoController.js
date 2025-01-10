const Crypto = require('../models/Crypto');
const calculateStdDev = require('../utils/calculateStdDev');

exports.getStats = async (req, res) => {
    try {
        const { coin } = req.query;

        if (!coin) return res.status(400).json({ error: 'Coin is required.' });

        const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

        if (!latestData) return res.status(404).json({ error: 'No data found for this coin.' });

        res.json({
            price: latestData.price,
            marketCap: latestData.marketCap,
            '24hChange': latestData.change24h
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDeviation = async (req, res) => {
    try {
        const { coin } = req.query;

        if (!coin) return res.status(400).json({ error: 'Coin is required.' });

        const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

        if (records.length === 0) return res.status(404).json({ error: 'No data found for this coin.' });

        const prices = records.map(record => record.price);
        const deviation = calculateStdDev(prices);

        res.json({ deviation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
