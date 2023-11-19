const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const STATUS_CODES = require('../constants/errors');

const createUser = async (req, res) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    })
    return res.status(201).send({
      email: newUser.email,
      _id: newUser._id,
    })
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).send({
        message: 'Неподходящий логин и/или пароль',
      })
    }
    const loginUser = await User.findOne({ email }).select('+password');
    if (!loginUser) {
      return res.status(STATUS_CODES.FORBIDDEN).send({
        message: 'Некорректный логин и/или пароль'
      })
    }
    const result = bcrypt.compare(password, loginUser.password)
      .then((matched) => {
        if (!matched) {
          return false;
        }
        return true;
      });
    if (!result) {
      res.status(STATUS_CODES.FORBIDDEN).send({
        message: 'Некорректный логин и/или пароль'
      })
    }

    const payload = { _id: loginUser._id }

    const token = jwt.sign(payload, 'VERY_SECRET_KEY', { expiresIn: '7d' })
    res.status(STATUS_CODES.OK).send({ token })
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на сервере',
    })
  }
}

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
  login,
  getUserById,
  getUsers,
  createUser,
  patchMe,
  patchAvatar,
};
