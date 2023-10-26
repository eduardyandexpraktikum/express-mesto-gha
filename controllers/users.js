const mongoose = require('mongoose');
const User = require('../models/user.js');
// const ObjectId = require('mongoose').Types.ObjectId;

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    return res.status(201).send(await newUser.save())
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({
        message: "Переданы некорректные данные при создании пользователя",
      });
    } else {
      return res.status(500).send({
        message: "Ошибка на сервере",
      });
    }
  }
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).send({
      message: "Некорректный id"
    });
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: "Пользователь не найден"
        });
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const patchMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.name = req.body.name;
    user.about = req.body.about;
    return res.status(201).send(await user.save());
  } catch (error) {
    return res.status(500).send({
      message: "Ошибка на сервере",
    });
  }
};

const patchAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.avatar = req.body.avatar;
    return res.status(201).send(await user.save());
  } catch (error) {
    return res.status(500).send({
      message: "Ошибка на сервере",
    });
  }
};

module.exports =
{
  getUserById,
  getUsers,
  createUser,
  patchMe,
  patchAvatar,
}
