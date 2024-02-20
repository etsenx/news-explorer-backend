const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const { login, register } = require('./controllers/users');
const auth = require('./middleware/auth');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/newsexplorer');
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const BASE_URL = process.env.BASE_PATH || 3000;

// app.use((req, res, next) => {
//   req.headers.authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQyZDk4MWRmZGQwMjg5NTQxMzQwNTMiLCJpYXQiOjE3MDgzMTczMjMsImV4cCI6MTcwODU3NjUyM30.ktenYN271XZk7UU88THSHxt2MvCBiQHtLsbxaYtQ2k4'
//   next();
// })

app.post('/login', login);
app.post('/register', register);

app.use('/users', auth, usersRoutes);

app.get('*', (req, res) => {
  res.send({ message: 'Sumber daya yang diminta tidak ada' });
})

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Terjadi kesalahan pada server' : message,
  })
})

app.listen(BASE_URL, () => {
  console.log("Running in port 3000")
})