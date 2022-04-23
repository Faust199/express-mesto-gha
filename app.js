const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const ObjectNotExistError = require('./errors/objectNotExistError');
const errorHandler = require('./errors/errorHandler');

const USER_PATH = '/users';
const CARD_PATH = '/cards';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    about: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new Error('Неправильный формат ссылки');
      }
      return value;
    }),
  }),
}), createUser);

app.use(auth);

app.use(USER_PATH, require('./routes/users'));
app.use(CARD_PATH, require('./routes/cards'));

app.use(errors());

app.use(() => {
  throw new ObjectNotExistError('такой url не найден');
});

app.use(() => {
  throw new ObjectNotExistError('такой url не найден');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
