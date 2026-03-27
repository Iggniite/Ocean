/*
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const apiRoutes = require('./routes/api');
const simulationEngine = require('./services/simulationEngine');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

async function startServer() {
  try {
    // Determine MongoDB URI
    let mongoUri = process.env.MONGO_URI;
    let mongod = null;
    
    if (!mongoUri) {
      console.log('No MONGO_URI provided. Starting in-memory MongoDB...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    // Start simulation engine after DB connection
    await simulationEngine.start();

    // Start Express app
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();  */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const apiRoutes = require('./routes/api');
const simulationEngine = require('./services/simulationEngine');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;
    let mongod = null;

    // Use in-memory DB if no external DB provided
    if (!mongoUri) {
      console.log('No MONGO_URI provided. Starting in-memory MongoDB...');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB`);

    // Start simulation engine (non-blocking)
    simulationEngine.start();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
