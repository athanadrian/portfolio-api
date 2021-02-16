const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./db');
const bodyParser = require('body-parser');

// call routes
const portfolios = require('./routes/portfolios');

// Get env variables
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

const server = express();

// Display http requests in the terminal only in dev mode
if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}

// Body parser
server.use(bodyParser.json());

// Use/Register Routes
server.use('/api/v1/portfolios', portfolios);

const PORT = process.env.PORT || 3001;

server.listen(PORT, (err) => {
  if (err) console.error('Error listening...', err);
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.red);
  // Close Server & exit process
  server.close(() => process.exit(1));
});
