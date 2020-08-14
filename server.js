require("dotenv").config();

const express = require('express');
var fs = require('fs');

var path = require('path');

var multer = require('multer');

const connectDB = require('./DB/Conncection');
var cors = require('cors')
const app = express();



connectDB();
app.use(express.json({ extended: false }));
app.use(cors()); 
// app.options('*', cors())
//app.options('http://localhost:4300', cors())

// app.use(multer({ dest: './uploads/',
//     rename: function (fieldname, filename) {
//       return filename;
//     },
//    }));
// app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, '/public')));


app.set('views', path.join(__dirname, '/views'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use('/api/userModel', require('./Api/User'));

//commit form githubdesktop
//commit form cli to git repo (from project path directly commmit)
//commit from knowledge 
const Port = process.env.PORT || 5000;   

app.listen(Port, () => console.log('Server started'));
