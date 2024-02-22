const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
const usersRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');
const { login, register } = require('./controllers/users');
const auth = require('./middleware/auth');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/newsexplorer');
const app = express();

const originListString = process.env.ALLOWED_ORIGIN;
const originList = originListString.split(',');
const corsOption = {
  origin: [originList],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOption));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const BASE_URL = process.env.BASE_PATH || 3000;

app.use(requestLogger);

app.post(
  '/login',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/register',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
    }),
  }),
  register,
);

app.use('/users', auth, usersRoutes);
app.use('/articles', auth, articlesRoutes);

app.get('*', (req, res) => {
  res.send({ message: 'Sumber daya yang diminta tidak ada' });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  console.log(err);
  if (isCelebrateError(err)) {
    statusCode = 400;
    message = err.message;
  }
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Terjadi kesalahan pada server' : message,
  });
});

app.listen(BASE_URL, () => {
  console.log('Running in port 3000');
});
