const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

const connectDB = require('./db');

// Get env variables
dotenv.config({ path: './config/config.env' });

// Get models
// const Contract = require('./db/models/Contract');
// const Message = require('./db/models/Message');
const Portfolio = require('./db/models/Portfolio');
// const Payment = require('./db/models/Payment');
// const Profile = require('./db/models/Profile');
// const Rental = require('./db/models/Rental');
// const User = require('./db/models/User');
//const Fee = require('./db/models/Fee');

// Connect to DB
connectDB();

// Read JSON files
// const contracts = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/contracts.json`, 'utf-8')
// );
// const messages = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/messages.json`, 'utf-8')
// );
// const payments = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/payments.json`, 'utf-8')
// );
const portfolios = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/portfolios.json`, 'utf-8')
);
// const profiles = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/profiles.json`, 'utf-8')
// );
// const rentals = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/rentals.json`, 'utf-8')
// );
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );
// const fees = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/fees.json`, 'utf-8')
// );

// Import data into DB
const importData = async () => {
  try {
    // await Contract.create(contracts);
    // await Message.create(messages);
    // await Payment.create(payments);
    await Portfolio.create(portfolios);
    // await Profile.create(profiles);
    // await Rental.create(rentals);
    // await User.create(users);
    // await Fee.create(fees);

    console.log('Data imported....'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    // await Contract.deleteMany();
    // await Message.deleteMany();
    // await Payment.deleteMany();
    // await Profile.deleteMany();
    await Portfolio.deleteMany();
    // await Rental.deleteMany();
    // await User.deleteMany();
    // await Fee.deleteMany();

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
