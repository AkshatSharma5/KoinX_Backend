# 💵 Cryptocurrency Tracker API Backend 
> [!NOTE]
> The site is live!<br/> Visit [here](https://koinx-backend.up.railway.app/api/stats?coin=bitcoin) for Live Stats and [here](https://koinx-backend.up.railway.app/api/deviation?coin=bitcoin) for Deviations

![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

A robust backend application for tracking and analyzing cryptocurrency data. Designed with Node.js and MongoDB, this server-side application supports scheduled updates, statistical computations, and more!

## ⚙️ Tech Stacks
- [Node.js](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [node-cron](https://www.npmjs.com/package/node-cron)

## ✨ Features
- 📊 Real-time Cryptocurrency Data Fetching
- 🕒 Scheduled Data Updates (Every 2 hours using `node-cron`)
- 🛠️ Robust API Endpoints for Standard Deviation, Historical Prices, etc.
- 💾 MongoDB Integration for Persistent Storage

## ✨ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (or local MongoDB)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cryptocurrency-tracker.git
cd cryptocurrency-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

4. Run the server
```bash
npm start
```

### 5. Access the API (IMPORTANT)
**There are 2 endpoints:**
- http://localhost:3000/api/stats?coin=NAME_OF_COIN
- http://localhost:3000/api/deviation?coin=NAME_OF_COIN
- (NAME_OF_COIN = `bitcoin`, `ethereum`, `matt` only for now)

## 🔄 Cron Job
The application uses `node-cron` to fetch cryptocurrency data every **2 hours**:
- **Cron Expression:** `0 */2 * * *`

## 📂 API Endpoints

### 1. Get Live Stats 🌍
- **URL:** `/api/stats`
- **Method:** `GET`
- **Query Parameters:**
  - `coin` (required): The cryptocurrency name (e.g., `bitcoin`, `ethereum`, `matt`)
- **Example:**
  ```bash
  curl "http://localhost:3000/api/deviation?coin=bitcoin"
  ```
- **Response:**
  ```json
{
  "price": 94281,
  "marketCap": 1866010142291.8635,
  "24hChange": -0.5380935379881129
}
    ```
### 2. Get Standard Deviation
- **URL:** `/api/deviation`
- **Method:** `GET`
- **Query Parameters:**
  - `coin` (required): The cryptocurrency name (e.g., `bitcoin`, `ethereum`, `matt`)
- **Example:**
  ```bash
  curl "http://localhost:3000/api/deviation?coin=bitcoin"
  ```
- **Response:**
  ```json
  {
    "deviation": 150.34
  }
  ```

#### 🛡️ Caution
> Ensure your MongoDB database is properly secured with authentication and IP **whitelisting** to prevent unauthorized access.

## 📈 Additional Features (Coming Soon!)
- ✅ User Authentication (JWT-based)
- ✅ GraphQL Support
- ✅ Advanced Statistical Analysis (e.g., Moving Averages, Volatility)

#### 🌐 Deployment : The site is deployed on **Railway** which can be accessed by  aforementioned links!

## 🤝 Contributing
1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📜 License
This project is licensed under the MIT License.

**If you have any suggestions or complaints regarding the project, feel free to contact me at akshatgopal70@gmail.com anytime!**

Good Day!✨
