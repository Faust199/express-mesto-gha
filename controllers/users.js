const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const handleError = require('../errors/customErrors');

const ERROR_CODE = 404;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        res.status(ERROR_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((userTemp) => {
      User.findById(userTemp.id)
        .then((user) => {
          res.send({ user });
        });
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .status(200)
        .cookie('Authorization', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, { name, about }, { runValidators: true, new: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate({ _id: req.user._id }, { avatar }, { runValidators: true, new: true })
    .then((user) => res.send({ user }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};
