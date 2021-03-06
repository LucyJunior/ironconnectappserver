 const express = require('express');
 const app = express();
 const path = require('path') 
 const mongoose = require('mongoose');
const morgan = require('morgan');
 const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
 const expressValidator = require('express-validator');
 const fs = require('fs');
 //cors package for security and prevent atackas, cross origin resource sharing
 const cors = require('cors');
 const dotenv = require('dotenv');
 dotenv.config();



 mongoose
     .connect(process.env.MONGO_URI, {
        useNewUrlParser: true
     })
     .then(() => console.log('DB Connected'));

 mongoose.connection.on('error', err => {
     console.log(`DB connection error: ${err.message}`);
 });

 // bring in routes
 const postRoutes = require('./routes/post');
 const authRoutes = require('./routes/auth');
 const userRoutes = require('./routes/user');
 // apiDocs
 app.get('/api', (req, res) => {
     //node file system
     fs.readFile('docs/apiDocs.json', (err, data) => {
         if (err) {
             res.status(400).json({
                error: err
             });
        }
        //json parse to pass the data
         const docs = JSON.parse(data);
          res.json(docs);
    });
 });


 
 // middleware -
 app.use(morgan('dev'));
 app.use(bodyParser.json());
 app.use(cookieParser());
 app.use(expressValidator());
 app.use(cors());
 app.use(express.static(path.join(__dirname, 'public')));
 app.use('/api', postRoutes);
 app.use('/api', authRoutes);
 app.use('/api', userRoutes);

 app.use((req, res, next) => {
    // If no routes match, send them the React HTML.
    res.sendFile(__dirname + "/public/index.html");
  });
 app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
       res.status(401).json({ error: 'Dude, you cant sorry!' });
    }
});

//  const port = process.env.PORT || 8080;
//  app.listen(port, () => {
//      console.log(`A Node Js API is listening on port: ${port}`);
//  });


 module.exports = app