const express = require('express');
const mongoose = require('mongoose');
const { signInValidation } = require('./middlewares/validator');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { checkAuth } = require('./middlewares/auth');
const app = express();
const { json } = require('express');
const { login, createUser } = require('./controllers/users');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use(json());

app.post('/signin', signInValidation, login);
app.post('/signup', signInValidation, createUser);

app.use(checkAuth);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/', (req, res, next) => {
  next(res.status(404).send({
    message: 'Невозможно отобразить страницу',
  }));
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = ServerError } = err;
  const message = statusCode === ServerError ? 'На сервере произошла ошибка.' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
