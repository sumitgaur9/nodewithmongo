const express = require('express');
const connectDB = require('./DB/Conncection');
const app = express();

connectDB();
app.use(express.json({ extended: false }));
app.use('/api/userModel', require('./Api/User'));
//app.use(cors()); 
const Port = process.env.PORT || 5000;

app.listen(Port, () => console.log('Server started'));
