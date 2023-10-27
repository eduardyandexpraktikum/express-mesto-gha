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
    if (!req.body.link || !req.body.name || req.body.name.length < 2 || req.body.name.length > 30) {
      return res.status(400).send({
        message: "Некорректные данные"
      });
    } else {
      return res.status(201).send(await newCard.save())
    };
  } catch (error) {
    return res.status(500).send({
      message: "Ошибка на сервере",
    });
  }
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id || !mongoose.isValidObjectId(cardId)) {
        res.status(400).send({
          message: "Невозможно удалить карточку"
        });
      } else if (!card) {
        res.status(404).send({
          message: "Карточка не найдена!"
        });
      } else {
        Card.deleteOne({ _id: cardId })
          .then((card) => {
            res.status(200).send({
              message: "Карточка удалена"
            });
          })
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      res.status(400).send({
        message: 'Некорректные данные'
      });
    } else if (!card) {
      res.status(404).send({
        message: 'Карточка с указанным _id не найдена.'
      });
    }
    else {
      res.send(card);
    }
  })
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      res.status(400).send({
        message: 'Некорректные данные'
      });
    } else if (!card) {
      res.status(404).send({
        message: 'Карточка с указанным _id не найдена.'
      });
    }
    else {
      res.send(card);
    }
  })
  .catch(next);

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
}