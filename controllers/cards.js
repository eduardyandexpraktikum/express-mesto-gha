const mongoose = require('mongoose');
const Card = require('../models/card.js');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const postCard = async (req, res) => {
  try {
    const newCard = new Card(req.body);
    newCard.owner = req.user._id;
    return res.status(201).send(await newCard.save())
  } catch (error) {
    return res.status(500).send({
      message: "Ошибка на сервере",
    });
  }
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  User.deleteOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: "Карточка не найдена!"
        });
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
}