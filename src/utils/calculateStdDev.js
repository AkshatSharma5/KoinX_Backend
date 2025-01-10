const calculateStdDev = (prices) => {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance).toFixed(2); // Returning fixed to 2 decimals
};

module.exports = calculateStdDev;
