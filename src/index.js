const app = require('./app');
const fetchCryptoData = require('./jobs/fetchCryptoData');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

cron.schedule('0 */2 * * *', fetchCryptoData); // Every 2 hours
console.log('Scheduled job to fetch crypto data every 2 hours.');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
