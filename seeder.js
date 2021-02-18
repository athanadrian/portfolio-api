const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

const connectDB = require('./db');

// Get env variables
dotenv.config({ path: './config/config.env' });

// Get models
const Blog = require('./db/models/Blog');
const Portfolio = require('./db/models/Portfolio');

// Connect to DB
connectDB();

// Read JSON files
const blogs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/blogs.json`, 'utf-8')
);
const portfolios = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/portfolios.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
  try {
    await Blog.create(blogs);
    await Portfolio.create(portfolios);

    console.log('Data imported....'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Blog.deleteMany();
    await Portfolio.deleteMany();

    console.log('Data deleted....'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
