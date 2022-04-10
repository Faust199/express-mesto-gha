const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const USER_PATH = '/users';
const CARD_PATH = '/cards';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6251c5ff4ebdff41b9b2e775',
  };
  next();
});

app.use(USER_PATH, require('./routes/users'));
app.use(CARD_PATH, require('./routes/cards'));

app.use((req, res, next) => {
  res.status(404).send({ message: 'такой путь не найден' });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
