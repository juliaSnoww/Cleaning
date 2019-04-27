const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./config/auth-init');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose
  .connect('mongodb+srv://yulek:DPuvQGHTIu6ki95O@cluster0-ikzkx.mongodb.net/test', {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to DataBase');
  })
  .catch(() => {
    console.log('Connection failed');
  });

const sessionStore = new MongoStore({
  url: 'mongodb+srv://yulek:DPuvQGHTIu6ki95O@cluster0-ikzkx.mongodb.net/test'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

const sessionMiddleware = session({
  store: sessionStore,
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000,
    httpOnly: false,
  }
});

app.use(cookieParser());
app.use(sessionMiddleware);
passportConfig();
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/user', userRoutes);

module.exports = app;
