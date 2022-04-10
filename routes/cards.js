const router = require('express').Router();
const {
  getCards, getCardById, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', getCardById);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
