const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { json } = require('express');

app.use((req, res, next) => {
  req.user = {
    _id: '65378e18dd992983ddecd0ec'
  };
  next();
});

app.use(json());

app.use(cardsRouter);
app.use(usersRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})