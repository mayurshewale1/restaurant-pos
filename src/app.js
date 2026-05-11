const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure CORS - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.4:3000',
  'http://192.168.1.4',
  'https://pos.hotelbattasesukhsagar.in',
  'https://sukhsagar.artifycode.com',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
].filter(Boolean); // Remove undefined/null

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost/192.168.x.x/10.x.x.x/172.16-31.x.x origin for development
    if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)(:\d+)?$/)) {
      return callback(null, true);
    }
    // Allow any origin with port 3000 (React dev server)
    if (origin.match(/^http:\/\/\d+\.\d+\.\d+\.\d+:3000$/)) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.get('/', (req, res) => res.json({ message: 'Restaurant Management API' }));

// Serve React single-page app static files if the client build exists
const clientBuildPath = path.resolve(__dirname, '..', '..', 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // For any route not handled by /api, send back index.html so React Router can handle routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
