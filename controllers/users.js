const User = require('../models/user');
const handleError = require('../errors/customErrors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
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
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  console.log(about);
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
