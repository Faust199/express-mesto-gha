const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCards, getCardById, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), getCardById);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), dislikeCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCard);

module.exports = router;
