const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const USER_PATH = '/users';
const CARD_PATH = '/cards';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use(USER_PATH, require('./routes/users'));
app.use(CARD_PATH, require('./routes/cards'));

app.use(errors());

app.use((req, res) => {
  res.status(404).send({ message: 'такой путь не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
