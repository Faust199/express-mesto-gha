const Card = require('../models/card');
const ValidationError = require('../errors/validationError');
const RoleError = require('../errors/roleError');
const ObjectNotExistError = require('../errors/objectNotExistError');

const CARD_OWNER = 'owner';

function errorHandler(err, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError(err.message));
  } else {
    next(err);
  }
}

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(CARD_OWNER)
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports.getCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(CARD_OWNER)
    .then((card) => res.send({ card }))
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(CARD_OWNER)
    .then((card) => {
      if (card) {
        if (card.owner.equals(req.user._id)) {
          return Card.deleteOne({ _id: req.params.cardId })
            .then(() => {
              res.send({ message: `Карточка с id:${req.params.cardId} удалена` });
            });
        }
        throw new RoleError('У вас нет прав на удаление карточки.');
      } else {
        throw new ObjectNotExistError('Карточки с таким id не существует.');
      }
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports.likeCard = (req, res, next) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { runValidators: true, new: true })
    .populate(CARD_OWNER)
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new ObjectNotExistError('Карточки с таким id не существует.');
      }
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  // eslint-disable-next-line max-len
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { runValidators: true, new: true })
    .populate(CARD_OWNER)
    .then((card) => {
      if (card) {
        res.send({ card });
      } else {
        throw new ObjectNotExistError('Карточки с таким id не существует.');
      }
    })
    .catch((err) => {
      errorHandler(err, next);
    });
};
