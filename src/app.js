const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || '*',
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
