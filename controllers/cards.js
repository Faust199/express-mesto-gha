const Card = require('../models/card');
const handleError = require('../errors/customErrors');

const CARD_OWNER = 'owner';
const ERROR_CODE = 404;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(CARD_OWNER)
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.getCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .populate(CARD_OWNER)
    .then((card) => res.send({ card }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .populate(CARD_OWNER)
    .then((card) => {
      if (card) {
        if (card.owner.id === req.user._id) {
          Card.deleteOne({ _id: req.params.cardId })
            .then(() => {
              res.send({ message: `Карточка с id:${req.params.cardId} удалена` });
            });
        } else {
          res.status(403).send({ message: 'У вас нет прав на удаление карточки.' });
        }
      } else {
        res.status(ERROR_CODE).send({ message: 'Карточки с таким id не существует.' });
      }
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.likeCard = (req, res) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { runValidators: true, new: true })
    .populate(CARD_OWNER)
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_CODE).send({ message: 'Карточки с таким id не существует.' });
      }
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { runValidators: true, new: true })
    .populate(CARD_OWNER)
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        res.status(ERROR_CODE).send({ message: 'Карточки с таким id не существует.' });
      }
    })
    .catch((err) => {
      const error = handleError(err);
      res.status(error.statusCode).send({ message: error.message });
    });
};
