const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const { json } = require('express');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use((req, res, next) => {
  req.user = {
    _id: '65378e18dd992983ddecd0ec',
  };
  next();
});

app.use(json());

app.use(cardsRouter);
app.use(usersRouter);
app.use('/', (req, res, next) => {
  next(res.status(404).send({
    message: 'Невозможно отобразить страницу',
  }));
});

app.listen(PORT);
