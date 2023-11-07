const mongoose = require('mongoose');
const User = require('../models/user');
const STATUS_CODES = require('../constants/errors');
// const ObjectId = require('mongoose').Types.ObjectId;

const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    res.status(201).send(await newUser.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка на сервере',
      });
    }
  }
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на сервере',
    }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    res.status(STATUS_CODES.BAD_REQUEST).send({
      message: 'Некорректный id',
    });
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_CODES.NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на сервере',
    }));
};

const patchMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.about = req.body.about;
    return res.status(STATUS_CODES.OK).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Некорректные данные',
      });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на сервере',
    });
  }
};

const patchAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.avatar = req.body.avatar;
    return res.status(STATUS_CODES.OK).send(await user.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Некорректные данные',
      });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на сервере',
    });
  }
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  patchMe,
  patchAvatar,
};
