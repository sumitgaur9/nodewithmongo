const express = require('express');
const connectDB = require('./DB/Conncection');
const app = express();

connectDB();
app.use(express.json({ extended: false }));
app.use('/api/userModel', require('./Api/User'));
//app.use(cors()); 
//commit form githubdesktop
//commit form cli to git repo (from project path directly commmit)
//commit from knowledge
//hey gauri pc
const Port = process.env.PORT || 5000;   

app.listen(Port, () => console.log('Server started'));
