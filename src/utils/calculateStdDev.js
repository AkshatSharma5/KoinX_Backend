const calculateStdDev = (prices) => {
    if (!prices.length) return 0; // Guard clause for empty array
  
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    console.log("Calculated mean:", mean);
  
    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    console.log("Calculated variance:", variance);
  
    return parseFloat(Math.sqrt(variance).toFixed(2)); // Ensure number is parsed back correctly
  };
  
  module.exports = calculateStdDev;
  