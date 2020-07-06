const mongoose = require('mongoose');

const URI ="mongodb+srv://dbUser:dbUser@cluster0-gnavp.mongodb.net/dbUser?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;
