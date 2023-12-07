const mongoose = require('mongoose');
const database = require('./config/db');
const express = require('express');
const app = express();
const PORT = 3300;
const nocache = require('nocache');
const expressLayout = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const ejs = require('ejs');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(nocache());

// Configure session middleware
app.use(
  session({
    secret: 'your-long-random-secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Use routes after session middleware
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// Serve static files
app.use(express.static('public'));
app.use('/admin', express.static(__dirname + '/public/admin'));
app.use(expressLayout);

const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the site`);
});

database.dbConnect();
