const express = require('express');

const app = express();
let i = new Date();

app.use((req, res, next) => {
  console.log(i.getMilliseconds());
  next();
});

app.use((req, res, next) => {
  res.send('hello From Express');
});


module.exports = app;
