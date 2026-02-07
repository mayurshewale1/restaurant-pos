require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./utils/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.connect();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
