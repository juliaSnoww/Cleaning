const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./config/auth-init');

const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');
const serviceRoutes = require('./routes/services');
const commentsRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const app = express();

mongoose
  .connect('mongodb://localhost:27017/test')
  // .connect('mongodb://yulek:DPuvQGHTIu6ki95O@cluster0-shard-00-00-ikzkx.mongodb.net:27017,cluster0-shard-00-01-ikzkx.mongodb.net:27017,cluster0-shard-00-02-ikzkx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to DataBase');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader('Access-Control-Allow-Credentials', true);
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
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 2628000000,
    httpOnly: false
  }
});


app.use(cookieParser());
app.use(sessionMiddleware);
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});
passportConfig();
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/user', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
