const app = require('./app');
const { fetchCryptoData } = require('./src/jobs/fetchCryptoData'); // Import as an object
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

// Schedule the fetchCryptoData function
// cron.schedule('0 */2 * * *', async () => {
//   console.log('Running scheduled job to fetch crypto data.');
//   await ;
// });
fetchCryptoData()
console.log('Scheduled job to fetch crypto data every 2 hours.');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
