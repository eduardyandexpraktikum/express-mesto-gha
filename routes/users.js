const userRouter = require('express').Router();

const {
  getUsers, getUserById, patchMe, patchAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);

userRouter.patch('/me', patchMe);
userRouter.patch('/me/avatar', patchAvatar);

module.exports = userRouter;
