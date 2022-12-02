const mongoose = require('mongoose');
//const config = require('../config');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;
